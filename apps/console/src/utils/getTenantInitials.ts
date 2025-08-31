const getTenantInitials = (tenantName: string): string => {
    // Trim whitespace and split into words
    const words = tenantName
        .trim()
        .split(/\s+/)
        .filter(word => word.length > 0);

    if (words.length === 0) {
        return '';
    }

    if (words.length === 1) {
        // For single word, take up to two characters
        return words[0].substring(0, 2).toUpperCase();
    }

    // For multiple words, take first letter of first two words
    return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
};

export default getTenantInitials;
