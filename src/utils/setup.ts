import { $ } from "bun";

export const firstTimeInstall = async () => {
    await $`bun node_modules/webview-bun/fetchLib.ts`

}