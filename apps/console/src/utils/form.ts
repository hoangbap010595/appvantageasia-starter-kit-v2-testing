export const isValidNumber = (event: any) => {
    const keyCode = event.keyCode || event.which;

    return keyCode >= 48 && keyCode <= 57;
};

export const onTelKeyPress = (event: any) => {
    const prevent = !isValidNumber(event);

    if (prevent) {
        event.preventDefault();
    }

    return prevent;
};
