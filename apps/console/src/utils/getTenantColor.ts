// Available colors
const colors = ['bg-blue-500 text-white', 'bg-green-500 text-white', 'bg-purple-500 text-white'];

const getTenantColor = (tenantName: string): string => {
    // Create a simple hash from the tenant name
    let hash = 0;

    for (let i = 0; i < tenantName.length; i++) {
        hash = (hash << 5) - hash + tenantName.charCodeAt(i);
        hash = hash & hash; // Convert to 32bit integer
    }

    // Make sure hash is positive
    hash = Math.abs(hash);

    // Map hash to one of the three colors
    return colors[hash % colors.length];
};

export default getTenantColor;
