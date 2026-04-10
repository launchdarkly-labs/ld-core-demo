from .base_operation import GraphQLField


class SessionGraphQLField(GraphQLField):
    def alias(self, alias: str) -> "SessionGraphQLField":
        self._alias = alias
        return self


class MatchConfigGraphQLField(GraphQLField):
    def alias(self, alias: str) -> "MatchConfigGraphQLField":
        self._alias = alias
        return self


class AttributeMatchConfigGraphQLField(GraphQLField):
    def alias(self, alias: str) -> "AttributeMatchConfigGraphQLField":
        self._alias = alias
        return self


class SpanEventMatchConfigGraphQLField(GraphQLField):
    def alias(self, alias: str) -> "SpanEventMatchConfigGraphQLField":
        self._alias = alias
        return self


class SpanSamplingConfigGraphQLField(GraphQLField):
    def alias(self, alias: str) -> "SpanSamplingConfigGraphQLField":
        self._alias = alias
        return self


class LogSamplingConfigGraphQLField(GraphQLField):
    def alias(self, alias: str) -> "LogSamplingConfigGraphQLField":
        self._alias = alias
        return self


class SamplingConfigGraphQLField(GraphQLField):
    def alias(self, alias: str) -> "SamplingConfigGraphQLField":
        self._alias = alias
        return self


class InitializeSessionResponseGraphQLField(GraphQLField):
    def alias(self, alias: str) -> "InitializeSessionResponseGraphQLField":
        self._alias = alias
        return self
