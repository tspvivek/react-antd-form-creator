import React from "react";
import { Form, Select, Input, Button, Row, Col, InputNumber } from "antd";

// Validation rule types
const VALIDATION_TYPES = [
    { value: "required", label: "Required" },
    { value: "email", label: "Email" },
    { value: "phone", label: "Phone Number" },
    { value: "alphabetsOnly", label: "Alphabets Only" },
    { value: "alphanumeric", label: "Alphanumeric" },
    { value: "minLength", label: "Min Length" },
    { value: "maxLength", label: "Max Length" },
    { value: "pattern", label: "Custom Pattern" }
];

// Group validation types by compatibility
// These are mutually exclusive - only one can be selected across all fields
const MUTUALLY_EXCLUSIVE_GROUPS = [["email", "phone", "alphabetsOnly", "alphanumeric", "pattern"]];

const CustomValidationRules = (props) => {
    return (
        <Form.List name={props.name}>
            {(fields, { add, remove }) => {
                // Get all selected validation types
                const getSelectedTypes = (getFieldValue) => {
                    const selectedTypes = [];
                    fields.forEach((field, index) => {
                        const type = getFieldValue(["rules", field.name, "type"]);
                        if (type) {
                            selectedTypes.push({ type, fieldName: field.name });
                        }
                    });
                    return selectedTypes;
                };

                return (
                    <Form.Item label="Validation Rules">
                        {fields.map((field, index) => (
                            <Row key={field.key} gutter={[16, 16]} align="middle" style={{ marginBottom: 8 }}>
                                <Col span={6}>
                                    <Form.Item
                                        noStyle
                                        shouldUpdate={(prevValues, currentValues) => {
                                            return (
                                                JSON.stringify(prevValues?.rules) !==
                                                JSON.stringify(currentValues?.rules)
                                            );
                                        }}
                                    >
                                        {({ getFieldValue }) => {
                                            // Current rule type
                                            const currentType = getFieldValue(["rules", field.name, "type"]);
                                            // All selected rule types
                                            const selectedTypes = getSelectedTypes(getFieldValue);

                                            // Function to check if option should be disabled
                                            const isOptionDisabled = (optionValue) => {
                                                // Don't disable the currently selected option in this field
                                                if (optionValue === currentType) {
                                                    return false;
                                                }

                                                // Check if option is already selected in another field
                                                if (
                                                    selectedTypes.some(
                                                        (selected) =>
                                                            selected.type === optionValue &&
                                                            selected.fieldName !== field.name
                                                    )
                                                ) {
                                                    return true;
                                                }

                                                // For mutually exclusive groups:
                                                for (const group of MUTUALLY_EXCLUSIVE_GROUPS) {
                                                    // If this option belongs to a mutually exclusive group
                                                    if (group.includes(optionValue)) {
                                                        // Check if any option from the same group is already selected in any field except this one
                                                        const isGroupMemberSelected = selectedTypes.some(
                                                            (selected) =>
                                                                selected.fieldName !== field.name &&
                                                                group.includes(selected.type)
                                                        );
                                                        if (isGroupMemberSelected) {
                                                            return true;
                                                        }
                                                    }
                                                }

                                                return false;
                                            };

                                            // Apply the disabled status to each option
                                            const options = VALIDATION_TYPES.map((option) => ({
                                                ...option,
                                                disabled: isOptionDisabled(option.value)
                                            }));

                                            return (
                                                <Form.Item
                                                    {...field}
                                                    name={[field.name, "type"]}
                                                    rules={[{ required: true, message: "Select rule type" }]}
                                                    noStyle
                                                >
                                                    <Select
                                                        placeholder="Select validation type"
                                                        options={options}
                                                        style={{ width: "100%" }}
                                                    />
                                                </Form.Item>
                                            );
                                        }}
                                    </Form.Item>
                                </Col>

                                <Col span={16}>
                                    <Form.Item
                                        noStyle
                                        shouldUpdate={(prevValues, currentValues) => {
                                            return (
                                                prevValues?.rules?.[field.name]?.type !==
                                                currentValues?.rules?.[field.name]?.type
                                            );
                                        }}
                                    >
                                        {({ getFieldValue }) => {
                                            const ruleType = getFieldValue(["rules", field.name, "type"]);

                                            if (ruleType === "minLength" || ruleType === "maxLength") {
                                                return (
                                                    <Form.Item
                                                        {...field}
                                                        name={[field.name, "value"]}
                                                        rules={[{ required: true, message: "Enter value" }]}
                                                        noStyle
                                                    >
                                                        <InputNumber
                                                            min={0}
                                                            placeholder="Length"
                                                            style={{ width: "100%" }}
                                                        />
                                                    </Form.Item>
                                                );
                                            }

                                            if (ruleType === "pattern") {
                                                return (
                                                    <Form.Item
                                                        {...field}
                                                        name={[field.name, "pattern"]}
                                                        rules={[{ required: true, message: "Enter regex pattern" }]}
                                                        noStyle
                                                    >
                                                        <Input
                                                            placeholder="Regular expression pattern (e.g. ^[a-zA-Z]+$)"
                                                            style={{ width: "100%" }}
                                                        />
                                                    </Form.Item>
                                                );
                                            }

                                            if (ruleType === "required") {
                                                return (
                                                    <Form.Item {...field} name={[field.name, "message"]} noStyle>
                                                        <Input
                                                            placeholder="Error message (optional)"
                                                            style={{ width: "100%" }}
                                                        />
                                                    </Form.Item>
                                                );
                                            }

                                            if (
                                                ["email", "phone", "alphabetsOnly", "alphanumeric"].includes(ruleType)
                                            ) {
                                                return (
                                                    <Form.Item {...field} name={[field.name, "message"]} noStyle>
                                                        <Input
                                                            placeholder="Error message (optional)"
                                                            style={{ width: "100%" }}
                                                        />
                                                    </Form.Item>
                                                );
                                            }

                                            return null;
                                        }}
                                    </Form.Item>
                                </Col>

                                <Col span={2}>
                                    <Button
                                        type="text"
                                        danger
                                        icon={<i className="fa fa-trash" />}
                                        onClick={() => remove(field.name)}
                                    />
                                </Col>
                            </Row>
                        ))}

                        <Form.Item>
                            <Form.Item
                                noStyle
                                shouldUpdate={(prevValues, currentValues) => {
                                    return JSON.stringify(prevValues?.rules) !== JSON.stringify(currentValues?.rules);
                                }}
                            >
                                {({ getFieldValue }) => {
                                    const selectedTypes = getSelectedTypes(getFieldValue).map((item) => item.type);

                                    // Find which validation types are already used
                                    const getAvailableTypes = () => {
                                        const availableTypes = [];

                                        // Check which options are not yet used
                                        for (const option of VALIDATION_TYPES) {
                                            if (!selectedTypes.includes(option.value)) {
                                                // Special case for mutually exclusive groups
                                                let isGroupMemberUsed = false;

                                                for (const group of MUTUALLY_EXCLUSIVE_GROUPS) {
                                                    if (group.includes(option.value)) {
                                                        // Check if any member of this group is already selected
                                                        isGroupMemberUsed = selectedTypes.some((type) =>
                                                            group.includes(type)
                                                        );
                                                        if (isGroupMemberUsed) break;
                                                    }
                                                }

                                                if (!isGroupMemberUsed) {
                                                    availableTypes.push(option.value);
                                                }
                                            }
                                        }

                                        return availableTypes;
                                    };

                                    const availableTypes = getAvailableTypes();
                                    const allTypesUsed = availableTypes.length === 0;

                                    return (
                                        <Button
                                            type="dashed"
                                            onClick={() => {
                                                // Find first available type that can be added
                                                const availableType = availableTypes[0] || "required";
                                                add({ type: availableType });
                                            }}
                                            block
                                            icon={<i className="fa fa-plus" />}
                                            disabled={allTypesUsed}
                                        >
                                            Add Validation Rule
                                        </Button>
                                    );
                                }}
                            </Form.Item>
                        </Form.Item>
                    </Form.Item>
                );
            }}
        </Form.List>
    );
};

export default CustomValidationRules;
