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

// GET /configs/:resourceId - Get config by resourceId
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

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Risk Assessment Documentation endpoint
app.get('/assess-risk', (req, res) => {
    try {
        const fs = require('fs');
        const path = require('path');
        const markdownPath = path.join(__dirname, 'CONFIG_RISK_ASSESSMENT_GUIDE.md');
        
        if (fs.existsSync(markdownPath)) {
            const markdownContent = fs.readFileSync(markdownPath, 'utf8');
            
            // Check if client wants JSON format or raw markdown
            const format = req.query.format || 'json';

            res.status(200).json({
                data: {
                    title: 'AI-Powered Configuration Risk Assessment Guide',
                    content: markdownContent,
                    contentType: 'markdown',
                    lastModified: fs.statSync(markdownPath).mtime.toISOString()
                }
            });
        } else {
            res.status(404).json({
                error: 'Documentation not found',
                message: 'Risk assessment guide documentation file not found'
            });
        }
    } catch (error) {
        res.status(500).json({
            error: 'Failed to load documentation',
            message: error.message
        });
    }
});

// Simple risk assessment endpoint (returns static example data)
app.post('/assess-risk', (req, res) => {
    try {
        const { newConfig } = req.body;

        if (!newConfig) {
            return res.status(400).json({
                error: 'Invalid request body',
                message: 'newConfig is required for risk assessment'
            });
        }

        // Load the risk assessment guide
        const fs = require('fs');
        const path = require('path');
        const markdownPath = path.join(__dirname, 'CONFIG_RISK_ASSESSMENT_GUIDE.md');
        
        let riskAssessmentGuide = null;
        if (fs.existsSync(markdownPath)) {
            riskAssessmentGuide = fs.readFileSync(markdownPath, 'utf8');
        }

        // Return example risk assessment data with guide
        const response = {
            data: {
                configurationData: newConfig,
                riskAssessmentGuide: riskAssessmentGuide
            }
        };

        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({
            error: 'Risk assessment failed',
            message: error.message
        });
    }
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
    console.log(`   GET    /configs/:resourceId  - Get config by resourceId`);
    console.log(`   POST   /configs              - Save config with resourceId in body`);
    console.log(`   PUT    /configs              - Update config with resourceId in body`);
    console.log(`   DELETE /configs              - Delete config with resourceId in body`);
    console.log(`📚 Documentation endpoints:`);
    console.log(`   GET    /risk-assessment-guide - Get risk assessment documentation`);
    console.log(`   POST   /configs/assess-risk   - Example risk assessment (placeholder)`);
});

module.exports = app;