const API_BASE_URL = 'http://127.0.0.1:5000';

export const checkHealth = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/health`);
        return await response.json();
    } catch (error) {
        console.error("Health check failed:", error);
        return { status: 'offline', message: 'Could not connect to backend engine' };
    }
};

export const getFeatures = async (disasterType = 'flood') => {
    try {
        const response = await fetch(`${API_BASE_URL}/features/${disasterType}`);
        return await response.json();
    } catch (error) {
        console.error("Failed to fetch features:", error);
        throw new Error("API Connection failed");
    }
};

export const predictDisaster = async (disasterType, data) => {
    try {
        const response = await fetch(`${API_BASE_URL}/predict/${disasterType}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ data: data }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Server fault: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Prediction sequence failed:", error);
        throw new Error(error.message === "Failed to fetch" ? "Network failure - backend offline." : error.message);
    }
};
