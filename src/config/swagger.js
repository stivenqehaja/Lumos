import swaggerJsdoc from 'swagger-jsdoc';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Lumos Casting Platform API',
            version: '1.0.0',
            description: 'API documentation for the Lumos Casting Management Platform',
            contact: {
                name: 'Lumos API Support',
                email: 'support@lumos.com'
            },
            license: {
                name: 'MIT',
                url: 'https://opensource.org/licenses/MIT'
            }
        },
        servers: [
            {
                url: 'http://localhost:3000',   
                description: 'Development server'
            },
            {
                url: process.env.BASE_URL || 'http://localhost:3000',
                description: 'Production server'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Enter JWT token obtained from /api/admin/login'
                }
            },
            schemas: {
                Admin: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string',
                            format: 'uuid',
                            description: 'Admin unique identifier'
                        },
                        username: {
                            type: 'string',
                            description: 'Admin username'
                        },
                        email: {
                            type: 'string',
                            format: 'email',
                            description: 'Admin email address'
                        }
                    }
                },
                Performer: {
                    type: 'object',
                    required: ['firstName', 'lastName', 'birthday', 'email', 'gender', 'height'],
                    properties: {
                        id: {
                            type: 'string',
                            format: 'uuid',
                            description: 'Performer unique identifier'
                        },
                        firstName: {
                            type: 'string',
                            description: 'First name'
                        },
                        lastName: {
                            type: 'string',
                            description: 'Last name'
                        },
                        birthday: {
                            type: 'string',
                            format: 'date',
                            description: 'Date of birth'
                        },
                        email: {
                            type: 'string',
                            format: 'email',
                            description: 'Email address'
                        },
                        phone: {
                            type: 'string',
                            description: 'Phone number'
                        },
                        gender: {
                            type: 'string',
                            enum: ['Male', 'Female'],
                            description: 'Gender'
                        },
                        height: {
                            type: 'integer',
                            description: 'Height in centimeters'
                        },
                        hairColor: {
                            type: 'string',
                            description: 'Hair color'
                        },
                        eyeColor: {
                            type: 'string',
                            description: 'Eye color'
                        },
                        skinTone: {
                            type: 'string',
                            description: 'Skin tone'
                        },
                        faceShape: {
                            type: 'string',
                            description: 'Face shape'
                        },
                        distinctiveMarks: {
                            type: 'string',
                            description: 'Distinctive marks or features'
                        },
                        images: {
                            type: 'array',
                            items: {
                                type: 'string'
                            },
                            description: 'Array of image URLs (base64 or URLs)'
                        },
                        profileImageIndex: {
                            type: 'integer',
                            default: 0,
                            description: 'Index of the primary profile image'
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time'
                        },
                        updatedAt: {
                            type: 'string',
                            format: 'date-time'
                        }
                    }
                },
                Client: {
                    type: 'object',
                    required: ['companyName', 'commercialDescription'],
                    properties: {
                        id: {
                            type: 'string',
                            format: 'uuid',
                            description: 'Client unique identifier'
                        },
                        companyName: {
                            type: 'string',
                            description: 'Company name'
                        },
                        commercialDescription: {
                            type: 'string',
                            description: 'Description of the commercial project'
                        },
                        accessCode: {
                            type: 'string',
                            description: 'Unique access code for client portal'
                        },
                        expiresAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Access code expiration date'
                        },
                        isActive: {
                            type: 'boolean',
                            default: true,
                            description: 'Whether the client access is active'
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time'
                        }
                    }
                },
                CastingGroup: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string',
                            format: 'uuid',
                            description: 'Casting group unique identifier'
                        },
                        clientId: {
                            type: 'string',
                            format: 'uuid',
                            description: 'Associated client ID'
                        },
                        performerIds: {
                            type: 'array',
                            items: {
                                type: 'string',
                                format: 'uuid'
                            },
                            description: 'Array of selected performer IDs'
                        },
                        isFinalized: {
                            type: 'boolean',
                            default: false,
                            description: 'Whether the casting selection is finalized'
                        }
                    }
                },
                CastingOrder: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string',
                            format: 'uuid',
                            description: 'Casting order unique identifier'
                        },
                        clientId: {
                            type: 'string',
                            format: 'uuid',
                            description: 'Associated client ID'
                        },
                        castingGroupId: {
                            type: 'string',
                            format: 'uuid',
                            description: 'Associated casting group ID'
                        },
                        companyName: {
                            type: 'string',
                            description: 'Company name'
                        },
                        commercialDescription: {
                            type: 'string',
                            description: 'Commercial description'
                        },
                        selectedPerformers: {
                            type: 'array',
                            items: {
                                $ref: '#/components/schemas/Performer'
                            },
                            description: 'Full performer objects selected for this casting'
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'When the order was finalized'
                        }
                    }
                },
                Error: {
                    type: 'object',
                    properties: {
                        error: {
                            type: 'string',
                            description: 'Error message'
                        }
                    }
                },
                LoginRequest: {
                    type: 'object',
                    required: ['username', 'password'],
                    properties: {
                        username: {
                            type: 'string',
                            description: 'Admin username'
                        },
                        password: {
                            type: 'string',
                            format: 'password',
                            description: 'Admin password'
                        }
                    }
                },
                LoginResponse: {
                    type: 'object',
                    properties: {
                        token: {
                            type: 'string',
                            description: 'JWT authentication token'
                        },
                        admin: {
                            $ref: '#/components/schemas/Admin'
                        }
                    }
                }
            }
        },
        tags: [
            {
                name: 'Admin',
                description: 'Admin authentication and management'
            },
            {
                name: 'Performers',
                description: 'Performer CRUD operations'
            },
            {
                name: 'Client',
                description: 'Client access and casting operations'
            },
            {
                name: 'Email',
                description: 'AI-powered email generation'
            }
        ]
    },
    apis: ['./src/routes/*.js'] // Path to the API routes
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
