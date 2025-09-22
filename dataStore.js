class DataStore {
    constructor() {
        this.data = new Map();
    }

    // Create or update a config for a resourceId
    saveConfig(resourceId, config) {
        const existingConfig = this.data.get(resourceId);
        const timestamp = new Date().toISOString();
        
        const configObject = {
            resourceId,
            config,
            createdAt: existingConfig ? existingConfig.createdAt : timestamp,
            updatedAt: timestamp
        };
        
        this.data.set(resourceId, configObject);
        return configObject;
    }

    // Read config by resourceId
    getConfig(resourceId) {
        return this.data.get(resourceId) || null;
    }

    // Read all configs
    getAllConfigs() {
        return Array.from(this.data.values());
    }

    // Delete config by resourceId
    deleteConfig(resourceId) {
        const config = this.data.get(resourceId);
        if (config) {
            this.data.delete(resourceId);
            return config;
        }
        return null;
    }

    // Check if config exists for resourceId
    hasConfig(resourceId) {
        return this.data.has(resourceId);
    }
}

module.exports = DataStore;