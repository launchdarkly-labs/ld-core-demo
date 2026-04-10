from importlib.metadata import metadata

_meta = metadata('launchdarkly-server-sdk-ai')

AI_SDK_NAME: str = _meta['Name']
AI_SDK_VERSION: str = _meta['Version']
AI_SDK_LANGUAGE: str = 'python'
