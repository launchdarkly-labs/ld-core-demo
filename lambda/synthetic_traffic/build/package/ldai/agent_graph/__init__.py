"""Graph implementation for managing AI agent graphs."""

from typing import Any, Callable, Dict, List, Optional, Set

from ldclient import Context

from ldai.models import AIAgentConfig, AIAgentGraphConfig, Edge
from ldai.tracker import AIGraphTracker

DEFAULT_FALSE = AIAgentConfig(key="", enabled=False)


class AgentGraphNode:
    """
    Node in an agent graph.
    """

    def __init__(
        self,
        key: str,
        config: AIAgentConfig,
        children: List[Edge],
    ):
        self._key = key
        self._config = config
        self._children = children

    def get_key(self) -> str:
        """Get the key of the node."""
        return self._key

    def get_config(self) -> AIAgentConfig:
        """Get the config of the node."""
        return self._config

    def is_terminal(self) -> bool:
        """Check if the node is a terminal node."""
        return len(self._children) == 0

    def get_edges(self) -> List[Edge]:
        """Get the edges of the node."""
        return self._children


class AgentGraphDefinition:
    """
    Graph implementation for managing AI agent graphs.
    """
    enabled: bool

    def __init__(
        self,
        agent_graph: AIAgentGraphConfig,
        nodes: Dict[str, AgentGraphNode],
        context: Context,
        enabled: bool,
        tracker: Optional[AIGraphTracker] = None,
    ):
        self._agent_graph = agent_graph
        self._context = context
        self._nodes = nodes
        self.enabled = enabled
        self._tracker = tracker

    def get_tracker(self) -> Optional[AIGraphTracker]:
        """
        Get the graph tracker for this graph definition.

        :return: The AIGraphTracker instance, or None if not available.
        """
        return self._tracker

    def is_enabled(self) -> bool:
        """Check if the graph is enabled."""
        return self.enabled

    @staticmethod
    def build_nodes(
        agent_graph: AIAgentGraphConfig,
        graph_nodes: Dict[str, AIAgentConfig],
    ) -> Dict[str, "AgentGraphNode"]:
        """Build the nodes of the graph into AgentGraphNode objects."""
        nodes = {
            agent_graph.root_config_key: AgentGraphNode(
                agent_graph.root_config_key,
                graph_nodes[agent_graph.root_config_key],
                [
                    edge
                    for edge in agent_graph.edges
                    if edge.source_config == agent_graph.root_config_key
                ],
            ),
        }

        for edge in agent_graph.edges:
            nodes[edge.target_config] = AgentGraphNode(
                edge.target_config,
                graph_nodes[edge.target_config],
                [e for e in agent_graph.edges if e.source_config == edge.target_config],
            )

        return nodes

    def get_node(self, key: str) -> Optional[AgentGraphNode]:
        """Get a node by its key."""
        return self._nodes.get(key)

    def _get_child_edges(self, config_key: str) -> List[Edge]:
        """Get the child edges of the given config."""
        return [
            edge for edge in self._agent_graph.edges if edge.source_config == config_key
        ]

    def get_child_nodes(self, node_key: str) -> List[AgentGraphNode]:
        """Get the child nodes of the given node key as AgentGraphNode objects."""
        nodes: List[AgentGraphNode] = []
        for edge in self._agent_graph.edges:
            if edge.source_config == node_key:
                node = self.get_node(edge.target_config)
                if node is not None:
                    nodes.append(node)
        return nodes

    def get_parent_nodes(self, node_key: str) -> List[AgentGraphNode]:
        """Get the parent nodes of the given node key as AgentGraphNode objects."""
        nodes: List[AgentGraphNode] = []
        for edge in self._agent_graph.edges:
            if edge.target_config == node_key:
                node = self.get_node(edge.source_config)
                if node is not None:
                    nodes.append(node)
        return nodes

    def _collect_nodes(
        self,
        node: AgentGraphNode,
        node_depths: Dict[str, int],
        nodes_by_depth: Dict[int, List[AgentGraphNode]],
        visited: Set[str],
        max_depth: int,
    ) -> None:
        """Collect all reachable nodes from the given node and group them by depth."""
        node_key = node.get_key()
        if node_key in visited:
            return
        visited.add(node_key)

        # Use max_depth for nodes not in node_depths to ensure they execute last
        node_depth = node_depths.get(node_key, max_depth)
        if node_depth not in nodes_by_depth:
            nodes_by_depth[node_depth] = []
        nodes_by_depth[node_depth].append(node)

        for child in self.get_child_nodes(node_key):
            self._collect_nodes(child, node_depths, nodes_by_depth, visited, max_depth)

    def terminal_nodes(self) -> List[AgentGraphNode]:
        """Get the terminal nodes of the graph, meaning any nodes without children."""
        return [
            node
            for node in self._nodes.values()
            if len(self.get_child_nodes(node.get_key())) == 0
        ]

    def root(self) -> Optional[AgentGraphNode]:
        """Get the root node of the graph."""
        return self._nodes.get(self._agent_graph.root_config_key)

    def traverse(
        self,
        fn: Callable[["AgentGraphNode", Dict[str, Any]], Any],
        execution_context: Optional[Dict[str, Any]] = None,
    ) -> Any:
        """Traverse from the root down to terminal nodes, visiting nodes in order of depth.
        Nodes with the longest paths from the root (deepest nodes) will always be visited last."""
        if execution_context is None:
            execution_context = {}

        root_node = self.root()
        if root_node is None:
            return

        node_depths: Dict[str, int] = {root_node.get_key(): 0}
        current_level: List[AgentGraphNode] = [root_node]
        depth = 0
        max_depth_limit = 10  # Infinite loop protection limit
        max_depth_encountered = 0
        seen_nodes: Set[str] = {root_node.get_key()}

        while current_level:
            next_level: List[AgentGraphNode] = []
            depth += 1

            for node in current_level:
                node_key = node.get_key()
                for child in self.get_child_nodes(node_key):
                    child_key = child.get_key()
                    if depth <= max_depth_limit:
                        # Defer this child to the next level if it's at a longer path
                        if child_key not in node_depths or depth > node_depths[child_key]:
                            node_depths[child_key] = depth
                            max_depth_encountered = max(max_depth_encountered, depth)
                        # Add to next level if not already visited (prevents cycles)
                        if child_key not in seen_nodes:
                            seen_nodes.add(child_key)
                            next_level.append(child)
                    else:
                        max_depth_encountered = max(max_depth_encountered, depth)
                        if child_key not in seen_nodes:
                            # Push this to the next level to be visited
                            seen_nodes.add(child_key)
                            next_level.append(child)

            current_level = next_level

        # Use max_depth_limit + 1 to ensure they execute after all recorded nodes
        max_depth = max(max_depth_limit + 1, max_depth_encountered + 1)

        # Group all nodes by depth
        nodes_by_depth: Dict[int, List[AgentGraphNode]] = {}
        # New visited for children nodes
        visited: Set[str] = set()

        self._collect_nodes(root_node, node_depths, nodes_by_depth, visited, max_depth)
        # Execute the lambda at this level for the nodes at this depth
        for depth_level in sorted(nodes_by_depth.keys()):
            for node in nodes_by_depth[depth_level]:
                execution_context[node.get_key()] = fn(node, execution_context)

        return execution_context[self._agent_graph.root_config_key]

    def reverse_traverse(
        self,
        fn: Callable[["AgentGraphNode", Dict[str, Any]], Any],
        execution_context: Optional[Dict[str, Any]] = None,
    ) -> Any:
        """Traverse from terminal nodes up to the root, visiting nodes level by level.
        The root node will always be visited last, even if multiple paths converge at it."""
        if execution_context is None:
            execution_context = {}

        terminal_nodes = self.terminal_nodes()
        if not terminal_nodes:
            return

        visited: Set[str] = set()
        current_level: List[AgentGraphNode] = terminal_nodes
        root_key = self._agent_graph.root_config_key
        root_node_seen = False

        while current_level:
            next_level: List[AgentGraphNode] = []

            for node in current_level:
                node_key = node.get_key()
                if node_key in visited:
                    continue

                visited.add(node_key)
                # Skip the root node if we reach a terminus, it will be visited last
                if node_key == root_key:
                    root_node_seen = True
                    continue

                execution_context[node_key] = fn(node, execution_context)

                for parent in self.get_parent_nodes(node_key):
                    parent_key = parent.get_key()
                    if parent_key not in visited:
                        next_level.append(parent)

            current_level = next_level

        # If we saw the root node, append it at the end as it'll always be the last node in a
        # reverse traversal (this should always happen, non-contiguous graphs are invalid)
        if root_node_seen:
            root_node = self.root()
            if root_node is not None:
                execution_context[root_node.get_key()] = fn(
                    root_node, execution_context
                )

        return execution_context[self._agent_graph.root_config_key]
