from typing import Any, Dict, Optional, Union

from .base_operation import GraphQLField
from .custom_typing_fields import (
    AttributeMatchConfigGraphQLField,
    InitializeSessionResponseGraphQLField,
    LogSamplingConfigGraphQLField,
    MatchConfigGraphQLField,
    SamplingConfigGraphQLField,
    SpanEventMatchConfigGraphQLField,
    SpanSamplingConfigGraphQLField,
)


class AttributeMatchConfigFields(GraphQLField):
    @classmethod
    def key(cls) -> "MatchConfigFields":
        return MatchConfigFields("key")

    @classmethod
    def attribute(cls) -> "MatchConfigFields":
        return MatchConfigFields("attribute")

    def fields(
        self, *subfields: Union[AttributeMatchConfigGraphQLField, "MatchConfigFields"]
    ) -> "AttributeMatchConfigFields":
        """Subfields should come from the AttributeMatchConfigFields class"""
        self._subfields.extend(subfields)
        return self

    def alias(self, alias: str) -> "AttributeMatchConfigFields":
        self._alias = alias
        return self


class InitializeSessionResponseFields(GraphQLField):
    secure_id: "InitializeSessionResponseGraphQLField" = (
        InitializeSessionResponseGraphQLField("secure_id")
    )
    project_id: "InitializeSessionResponseGraphQLField" = (
        InitializeSessionResponseGraphQLField("project_id")
    )

    @classmethod
    def sampling(cls) -> "SamplingConfigFields":
        return SamplingConfigFields("sampling")

    def fields(
        self,
        *subfields: Union[InitializeSessionResponseGraphQLField, "SamplingConfigFields"]
    ) -> "InitializeSessionResponseFields":
        """Subfields should come from the InitializeSessionResponseFields class"""
        self._subfields.extend(subfields)
        return self

    def alias(self, alias: str) -> "InitializeSessionResponseFields":
        self._alias = alias
        return self


class LogSamplingConfigFields(GraphQLField):
    @classmethod
    def attributes(cls) -> "AttributeMatchConfigFields":
        return AttributeMatchConfigFields("attributes")

    @classmethod
    def message(cls) -> "MatchConfigFields":
        return MatchConfigFields("message")

    @classmethod
    def severity_text(cls) -> "MatchConfigFields":
        return MatchConfigFields("severity_text")

    sampling_ratio: "LogSamplingConfigGraphQLField" = LogSamplingConfigGraphQLField(
        "samplingRatio"
    )

    def fields(
        self,
        *subfields: Union[
            LogSamplingConfigGraphQLField,
            "AttributeMatchConfigFields",
            "MatchConfigFields",
        ]
    ) -> "LogSamplingConfigFields":
        """Subfields should come from the LogSamplingConfigFields class"""
        self._subfields.extend(subfields)
        return self

    def alias(self, alias: str) -> "LogSamplingConfigFields":
        self._alias = alias
        return self


class MatchConfigFields(GraphQLField):
    regex_value: "MatchConfigGraphQLField" = MatchConfigGraphQLField("regexValue")
    match_value: "MatchConfigGraphQLField" = MatchConfigGraphQLField("matchValue")

    def fields(self, *subfields: MatchConfigGraphQLField) -> "MatchConfigFields":
        """Subfields should come from the MatchConfigFields class"""
        self._subfields.extend(subfields)
        return self

    def alias(self, alias: str) -> "MatchConfigFields":
        self._alias = alias
        return self


class SamplingConfigFields(GraphQLField):
    @classmethod
    def spans(cls) -> "SpanSamplingConfigFields":
        return SpanSamplingConfigFields("spans")

    @classmethod
    def logs(cls) -> "LogSamplingConfigFields":
        return LogSamplingConfigFields("logs")

    def fields(
        self,
        *subfields: Union[
            SamplingConfigGraphQLField,
            "LogSamplingConfigFields",
            "SpanSamplingConfigFields",
        ]
    ) -> "SamplingConfigFields":
        """Subfields should come from the SamplingConfigFields class"""
        self._subfields.extend(subfields)
        return self

    def alias(self, alias: str) -> "SamplingConfigFields":
        self._alias = alias
        return self


class SpanEventMatchConfigFields(GraphQLField):
    @classmethod
    def name(cls) -> "MatchConfigFields":
        return MatchConfigFields("name")

    @classmethod
    def attributes(cls) -> "AttributeMatchConfigFields":
        return AttributeMatchConfigFields("attributes")

    def fields(
        self,
        *subfields: Union[
            SpanEventMatchConfigGraphQLField,
            "AttributeMatchConfigFields",
            "MatchConfigFields",
        ]
    ) -> "SpanEventMatchConfigFields":
        """Subfields should come from the SpanEventMatchConfigFields class"""
        self._subfields.extend(subfields)
        return self

    def alias(self, alias: str) -> "SpanEventMatchConfigFields":
        self._alias = alias
        return self


class SpanSamplingConfigFields(GraphQLField):
    @classmethod
    def name(cls) -> "MatchConfigFields":
        return MatchConfigFields("name")

    @classmethod
    def attributes(cls) -> "AttributeMatchConfigFields":
        return AttributeMatchConfigFields("attributes")

    @classmethod
    def events(cls) -> "SpanEventMatchConfigFields":
        return SpanEventMatchConfigFields("events")

    sampling_ratio: "SpanSamplingConfigGraphQLField" = SpanSamplingConfigGraphQLField(
        "samplingRatio"
    )

    def fields(
        self,
        *subfields: Union[
            SpanSamplingConfigGraphQLField,
            "AttributeMatchConfigFields",
            "MatchConfigFields",
            "SpanEventMatchConfigFields",
        ]
    ) -> "SpanSamplingConfigFields":
        """Subfields should come from the SpanSamplingConfigFields class"""
        self._subfields.extend(subfields)
        return self

    def alias(self, alias: str) -> "SpanSamplingConfigFields":
        self._alias = alias
        return self
