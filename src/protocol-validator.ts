import Ajv from "ajv";

const ajv = new Ajv()
const schema = {
    type: "object",
    properties: {},
    additionalProperties: {
        type: "array",
        items: {
            oneOf: [
                {
                    // v1: list of instructions "vanilla"
                    type: "string"
                },
                {
                    oneOf: [
                        { // v3.1: instructions with the 4 combinations of ambient/mask + sample/purge "standardized"
                            type: "object",
                            properties: {
                                "title": {type: "string"},
                                "instructions": {type: "string"},
                                "ambient_purge": {type: "integer", minimum: 0, maximum: 10},
                                "ambient_sample": {type: "integer", minimum: 0, maximum: 60},
                                "mask_purge": {type: "integer", minimum: 0, maximum: 10},
                                "mask_sample": {type: "integer", minimum: 0, maximum: 600},
                            },
                            required: ["instructions"],
                            additionalProperties: false
                        },
                    ]
                }
            ]
        }
    }
}
export const validateProtocols = ajv.compile(schema);
