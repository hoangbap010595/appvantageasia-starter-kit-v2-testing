// because in Cypress we cannot spy/stub on Window.Location
// We create a proxy function to call when calling window.location.href
// When Cypress runtime is identified, an event is dispatched instead
// By doing so we may test the redirection target
const assignNewLocation = (url: string) => {
    // @ts-expect-error TS2339: Property 'Cypress' does not exist on type 'Window & typeof globalThis'.
    if (window.Cypress) {
        window.dispatchEvent(new CustomEvent('location:assign', { detail: { url } }));

        return;
    }

    window.location.href = url;
};

export default assignNewLocation;
