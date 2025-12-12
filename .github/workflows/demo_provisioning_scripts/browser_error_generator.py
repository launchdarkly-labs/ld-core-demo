import subprocess
import logging
import os

logger = logging.getLogger(__name__)

def generate_frontend_errors(demo_namespace: str, num_visits: int = 20):
    """uses puppeteer to visit demo app and trigger frontend observability errors"""
    script_dir = os.path.dirname(os.path.abspath(__file__))
    node_script = os.path.join(script_dir, 'puppeteer_visitor.js')
    
    app_url = f"https://{demo_namespace}.launchdarklydemos.com"
    
    try:
        result = subprocess.run(
            ['node', node_script, app_url, str(num_visits)],
            capture_output=True,
            text=True,
            timeout=120
        )
        
        if result.returncode == 0:
            logger.info(f"Generated frontend errors via browser at {app_url}")
            if result.stdout:
                logger.debug(result.stdout)
        else:
            logger.error(f"Browser automation failed: {result.stderr}")
            
    except subprocess.TimeoutExpired:
        logger.error("Browser automation timed out")
    except FileNotFoundError:
        logger.error("Node.js not found - install Node.js for browser error generation")
    except Exception as e:
        logger.error(f"Browser automation error: {e}")

