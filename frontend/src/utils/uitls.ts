export function mapType(type: string | null): "number" | "text" | "boolean" {
    switch (type) {
        case "number":
        case "integer":
            return "number";
        case "boolean":
            return "boolean";
        default:
            return "text"; // fallback for null or unknown types
    }
}

