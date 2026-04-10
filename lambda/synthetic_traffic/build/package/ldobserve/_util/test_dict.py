from .dict import flatten_dict


def test_flatten_dict_simple():
    """Test flattening a simple dictionary has no effect."""
    input_dict = {"a": 1, "b": 2, "c": 3}
    expected = {"a": 1, "b": 2, "c": 3}
    result = flatten_dict(input_dict)
    assert result == expected


def test_flatten_dict_nested():
    """Test flattening a nested dictionary."""
    input_dict = {"a": 1, "b": {"c": 2, "d": 3}, "e": 4}
    expected = {"a": 1, "b.c": 2, "b.d": 3, "e": 4}
    result = flatten_dict(input_dict)
    assert result == expected


def test_flatten_dict_deeply_nested():
    """Test flattening a deeply nested dictionary."""
    input_dict = {"a": {"b": {"c": {"d": 1, "e": 2}, "f": 3}, "g": 4}, "h": 5}
    expected = {"a.b.c.d": 1, "a.b.c.e": 2, "a.b.f": 3, "a.g": 4, "h": 5}
    result = flatten_dict(input_dict)
    assert result == expected


def test_flatten_dict_with_custom_separator():
    """Test flattening with a custom separator."""
    input_dict = {"a": {"b": {"c": 1}}}
    expected = {"a_b_c": 1}
    result = flatten_dict(input_dict, sep="_")
    assert result == expected


def test_flatten_dict_with_mixed_types():
    """Test flattening with mixed value types."""
    input_dict = {
        "a": 1,
        "b": "string",
        "c": {"d": True, "e": None, "f": [1, 2, 3]},
        "g": 3.14,
    }
    expected = {
        "a": 1,
        "b": "string",
        "c.d": True,
        "c.e": None,
        "c.f": [1, 2, 3],
        "g": 3.14,
    }
    result = flatten_dict(input_dict)
    assert result == expected


def test_flatten_dict_empty():
    """Test flattening an empty dictionary."""
    input_dict = {}
    expected = {}
    result = flatten_dict(input_dict)
    assert result == expected


def test_flatten_dict_with_empty_nested_dict():
    """Test flattening with empty nested dictionaries."""
    input_dict = {"a": {}, "b": {"c": {}}, "d": 1}
    expected = {"d": 1}
    result = flatten_dict(input_dict)
    assert result == expected


def test_flatten_dict_preserves_original():
    """Test that the original dictionary is not modified."""
    input_dict = {"a": {"b": 1}}
    original = input_dict.copy()
    flatten_dict(input_dict)
    assert input_dict == original


def test_flatten_dict_with_complex_nesting():
    """Test flattening with complex nested structure."""
    input_dict = {
        "user": {
            "profile": {
                "name": "John",
                "age": 30,
                "address": {"street": "123 Main St", "city": "Anytown"},
            },
            "settings": {
                "theme": "dark",
                "notifications": {"email": True, "sms": False},
            },
        },
        "metadata": {"version": "1.0", "tags": ["important", "user"]},
    }
    expected = {
        "user.profile.name": "John",
        "user.profile.age": 30,
        "user.profile.address.street": "123 Main St",
        "user.profile.address.city": "Anytown",
        "user.settings.theme": "dark",
        "user.settings.notifications.email": True,
        "user.settings.notifications.sms": False,
        "metadata.version": "1.0",
        "metadata.tags": ["important", "user"],
    }
    result = flatten_dict(input_dict)
    assert result == expected


def test_flatten_dict_with_duplicate_keys():
    """Test flattening with potential duplicate keys after flattening."""
    input_dict = {"a": {"b": 1}, "a.b": 2}
    expected = {"a.b": 1, "a.b": 2}
    result = flatten_dict(input_dict)
    assert result == {"a.b": 2}
