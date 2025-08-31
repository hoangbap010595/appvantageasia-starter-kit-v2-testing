export enum DeviceType {
    Desktop = 'desktop',
    Tablet = 'tablet',
    Mobile = 'mobile',
}

const getDeviceType = (userAgent: string) => {
    if (/android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase())) {
        if (/ipad|tablet|playbook|silk/.test(userAgent.toLowerCase())) {
            return DeviceType.Tablet;
        }

        return DeviceType.Mobile;
    }

    return DeviceType.Desktop;
};

export default getDeviceType;
