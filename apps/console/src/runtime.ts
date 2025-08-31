// eslint-disable-next-line @typescript-eslint/consistent-type-imports
export type Runtime = import('@appvantageasia/backend/src/expressServer/handlers/serveConsole/getRuntime').Runtime;

const runtimeContainer = document.querySelector('[data-role="runtime-config"]') as HTMLElement;

const runtime = JSON.parse(runtimeContainer.innerText) as Runtime;

export default runtime;
