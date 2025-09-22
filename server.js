const express = require('express');
const cors = require('cors');
const DataStore = require('./dataStore');

const app = express();
const port = process.env.PORT || 3000;

// Initialize data store
const dataStore = new DataStore();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Error handling middleware
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

// Validation middleware
const validateResourceId = (req, res, next) => {
    const { resourceId } = req.params;
    if (!resourceId || typeof resourceId !== 'string' || resourceId.trim() === '') {
        return res.status(400).json({
            error: 'Invalid or missing resourceId',
            message: 'resourceId must be a non-empty string'
        });
    }
    next();
};

// Routes

// GET /configs - Get all configurations
app.get('/configs', asyncHandler(async (req, res) => {
    try {
        const configs = dataStore.getAllConfigs();
        res.json({
            success: true,
            count: configs.length,
            data: configs
        });
    } catch (error) {
        res.status(500).json({
            error: 'Internal server error',
            message: error.message
        });
    }
}));

// GET /configs/:resourceId - Get config by resourceId (keep for backwards compatibility)
app.get('/configs/:resourceId', validateResourceId, asyncHandler(async (req, res) => {
    try {
        const { resourceId } = req.params;
        const config = dataStore.getConfig(resourceId);
        
        if (!config) {
            return res.status(404).json({
                error: 'Configuration not found',
                message: `Configuration for resourceId '${resourceId}' does not exist`
            });
        }

        res.json({
            success: true,
            data: config
        });
    } catch (error) {
        res.status(500).json({
            error: 'Internal server error',
            message: error.message
        });
    }
}));

// POST /configs - Save config with resourceId in body
app.post('/configs', asyncHandler(async (req, res) => {
    try {
        const { resourceId, ...configData } = req.body;

        if (!resourceId || typeof resourceId !== 'string' || resourceId.trim() === '') {
            return res.status(400).json({
                error: 'Invalid or missing resourceId',
                message: 'resourceId must be provided as a non-empty string in the request body'
            });
        }

        if (!configData || Object.keys(configData).length === 0) {
            return res.status(400).json({
                error: 'Invalid request body',
                message: 'Request body must contain configuration data along with resourceId'
            });
        }

        const savedConfig = dataStore.saveConfig(resourceId, configData);
        const isUpdate = savedConfig.createdAt !== savedConfig.updatedAt;
        
        res.status(isUpdate ? 200 : 201).json({
            success: true,
            message: isUpdate ? 'Configuration updated successfully' : 'Configuration created successfully',
            data: savedConfig
        });
    } catch (error) {
        res.status(500).json({
            error: 'Internal server error',
            message: error.message
        });
    }
}));

// POST /configs/:resourceId - Save config for resourceId (keep for backwards compatibility)
app.post('/configs/:resourceId', validateResourceId, asyncHandler(async (req, res) => {
    try {
        const { resourceId } = req.params;
        const configData = req.body;

        if (!configData || typeof configData !== 'object') {
            return res.status(400).json({
                error: 'Invalid request body',
                message: 'Request body must be a valid configuration object'
            });
        }

        const savedConfig = dataStore.saveConfig(resourceId, configData);
        const isUpdate = savedConfig.createdAt !== savedConfig.updatedAt;
        
        res.status(isUpdate ? 200 : 201).json({
            success: true,
            message: isUpdate ? 'Configuration updated successfully' : 'Configuration created successfully',
            data: savedConfig
        });
    } catch (error) {
        res.status(500).json({
            error: 'Internal server error',
            message: error.message
        });
    }
}));

// PUT /configs - Update config with resourceId in body
app.put('/configs', asyncHandler(async (req, res) => {
    try {
        const { resourceId, ...configData } = req.body;

        if (!resourceId || typeof resourceId !== 'string' || resourceId.trim() === '') {
            return res.status(400).json({
                error: 'Invalid or missing resourceId',
                message: 'resourceId must be provided as a non-empty string in the request body'
            });
        }

        if (!configData || Object.keys(configData).length === 0) {
            return res.status(400).json({
                error: 'Invalid request body',
                message: 'Request body must contain configuration data along with resourceId'
            });
        }

        const savedConfig = dataStore.saveConfig(resourceId, configData);
        
        res.json({
            success: true,
            message: 'Configuration updated successfully',
            data: savedConfig
        });
    } catch (error) {
        res.status(500).json({
            error: 'Internal server error',
            message: error.message
        });
    }
}));

// PUT /configs/:resourceId - Update config for resourceId (keep for backwards compatibility)
app.put('/configs/:resourceId', validateResourceId, asyncHandler(async (req, res) => {
    try {
        const { resourceId } = req.params;
        const configData = req.body;

        if (!configData || typeof configData !== 'object') {
            return res.status(400).json({
                error: 'Invalid request body',
                message: 'Request body must be a valid configuration object'
            });
        }

        const savedConfig = dataStore.saveConfig(resourceId, configData);
        const isUpdate = savedConfig.createdAt !== savedConfig.updatedAt;
        
        res.status(isUpdate ? 200 : 201).json({
            success: true,
            message: isUpdate ? 'Configuration updated successfully' : 'Configuration created successfully',
            data: savedConfig
        });
    } catch (error) {
        res.status(500).json({
            error: 'Internal server error',
            message: error.message
        });
    }
}));

// PUT /configs/:resourceId - Update config for resourceId (same as POST)
app.put('/configs/:resourceId', validateResourceId, asyncHandler(async (req, res) => {
    try {
        const { resourceId } = req.params;
        const configData = req.body;

        if (!configData || typeof configData !== 'object') {
            return res.status(400).json({
                error: 'Invalid request body',
                message: 'Request body must be a valid configuration object'
            });
        }

        const savedConfig = dataStore.saveConfig(resourceId, configData);
        
        res.json({
            success: true,
            message: 'Configuration updated successfully',
            data: savedConfig
        });
    } catch (error) {
        res.status(500).json({
            error: 'Internal server error',
            message: error.message
        });
    }
}));

// DELETE /configs - Delete config with resourceId in body
app.delete('/configs', asyncHandler(async (req, res) => {
    try {
        const { resourceId } = req.body;

        if (!resourceId || typeof resourceId !== 'string' || resourceId.trim() === '') {
            return res.status(400).json({
                error: 'Invalid or missing resourceId',
                message: 'resourceId must be provided as a non-empty string in the request body'
            });
        }

        const deletedConfig = dataStore.deleteConfig(resourceId);
        
        if (!deletedConfig) {
            return res.status(404).json({
                error: 'Configuration not found',
                message: `Configuration for resourceId '${resourceId}' does not exist`
            });
        }

        res.json({
            success: true,
            message: 'Configuration deleted successfully',
            data: deletedConfig
        });
    } catch (error) {
        res.status(500).json({
            error: 'Internal server error',
            message: error.message
        });
    }
}));

// DELETE /configs/:resourceId - Delete config by resourceId (keep for backwards compatibility)
app.delete('/configs/:resourceId', validateResourceId, asyncHandler(async (req, res) => {
    try {
        const { resourceId } = req.params;
        const deletedConfig = dataStore.deleteConfig(resourceId);
        
        if (!deletedConfig) {
            return res.status(404).json({
                error: 'Configuration not found',
                message: `Configuration for resourceId '${resourceId}' does not exist`
            });
        }

        res.json({
            success: true,
            message: 'Configuration deleted successfully',
            data: deletedConfig
        });
    } catch (error) {
        res.status(500).json({
            error: 'Internal server error',
            message: error.message
        });
    }
}));

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Endpoint not found',
        message: `The endpoint ${req.method} ${req.originalUrl} does not exist`
    });
});

// Global error handler
app.use((error, req, res, next) => {
    console.error('Unhandled error:', error);
    res.status(500).json({
        error: 'Internal server error',
        message: 'An unexpected error occurred'
    });
});

// Start server
app.listen(port, () => {
    console.log(`🚀 Risk Configuration API server is running on port ${port}`);
    console.log(`📖 Health check: http://localhost:${port}/health`);
    console.log(`🔍 API endpoints:`);
    console.log(`   GET    /configs              - Get all configurations`);
    console.log(`   GET    /configs/:resourceId  - Get config by resourceId (legacy)`);
    console.log(`   POST   /configs              - Save config with resourceId in body`);
    console.log(`   POST   /configs/:resourceId  - Save config for resourceId (legacy)`);
    console.log(`   PUT    /configs              - Update config with resourceId in body`);
    console.log(`   PUT    /configs/:resourceId  - Update config for resourceId (legacy)`);
    console.log(`   DELETE /configs              - Delete config with resourceId in body`);
    console.log(`   DELETE /configs/:resourceId  - Delete config by resourceId (legacy)`);
});

module.exports = app;