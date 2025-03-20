// Helper function for mobile detection
export const isMobile = (breakpoint) => {
    return (breakpoint?.xs || breakpoint?.sm || breakpoint?.md) && !breakpoint?.lg;
};

// Generate validation rules for Ant Design Form
export const generateValidationRules = (rules = []) => {
    if (!Array.isArray(rules) || rules.length === 0) {
        return undefined;
    }

    return rules
        .map((rule) => {
            const { type, message, required } = rule;

            // Required rule is standard
            if (type === "required" || required === true) {
                return {
                    required: true,
                    message: message || "This field is required"
                };
            }

            // Email validation
            if (type === "email") {
                return {
                    type: "email",
                    message: message || "Please enter a valid email address"
                };
            }

            // Phone number validation
            if (type === "phone") {
                return {
                    pattern: /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/,
                    message: message || "Please enter a valid phone number"
                };
            }

            // Alphabets only validation
            if (type === "alphabetsOnly") {
                return {
                    pattern: /^[a-zA-Z\s]*$/,
                    message: message || "Only alphabets are allowed"
                };
            }

            // Alphanumeric validation
            if (type === "alphanumeric") {
                return {
                    pattern: /^[a-zA-Z0-9\s]*$/,
                    message: message || "Only letters and numbers are allowed"
                };
            }

            // Min length validation
            if (type === "minLength" && rule.value) {
                return {
                    min: rule.value,
                    message: message || `Minimum ${rule.value} characters required`
                };
            }

            // Max length validation
            if (type === "maxLength" && rule.value) {
                return {
                    max: rule.value,
                    message: message || `Maximum ${rule.value} characters allowed`
                };
            }

            // Custom pattern validation
            if (type === "pattern" && rule.pattern) {
                try {
                    const regex = new RegExp(rule.pattern);
                    return {
                        pattern: regex,
                        message: message || "Input format is invalid"
                    };
                } catch (e) {
                    console.error("Invalid regex pattern:", e);
                    return null;
                }
            }

            return null;
        })
        .filter(Boolean);
};
