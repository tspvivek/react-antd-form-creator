import React from "react";
import { Button, Form, Input, Space } from "antd";

const Options = (props) => {
    return (
        <Form.List name={props.name}>
            {(fields, { add, remove }) => (
                <Form.Item label="Options">
                    {fields.map((field) => (
                        <Space key={field.key} align="baseline" style={{ display: "flex", flexDirection: "row" }}>
                            <Form.Item 
                                {...field} 
                                name={[field.name, "label"]}
                                rules={[
                                    {
                                        required: true,
                                        message: "Please enter an option label",
                                    },
                                ]}
                            >
                                <Input 
                                    placeholder="Option Text" 
                                    onChange={(e) => {
                                        // Get the current form instance
                                        const form = props.form;
                                        if (form) {
                                            // Get all options values
                                            const values = form.getFieldValue(props.name) || [];
                                            // Update the value to match the label
                                            values[field.name] = {
                                                ...values[field.name],
                                                value: e.target.value,
                                            };
                                            // Set the updated values
                                            form.setFieldsValue({
                                                [props.name]: values,
                                            });
                                        }
                                    }} 
                                />
                            </Form.Item>
                            <i className="fa fa-minus-circle" onClick={() => remove(field.name)} />
                        </Space>
                    ))}

                    <Form.Item>
                        <Button 
                            type="dashed" 
                            onClick={() => add({label: "", value: ""})} 
                            block
                        >
                            Add Option
                        </Button>
                    </Form.Item>
                </Form.Item>
            )}
        </Form.List>
    );
};

export default Options;
