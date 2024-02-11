import { parseArgs } from "util";
import { LogColor, colorText } from "./utils/cli";
try {
    const { values, positionals } = parseArgs({
        args: Bun.argv,
        options: {
            build: {
                type: 'boolean',
            },
            dev: {
                type: 'boolean',
            },
        },
        strict: true,
        allowPositionals: true,
    });

    if (values.build) {
        console.log("Building...");
    }

    if (values.dev) {
        console.log("Development mode...");
    }

} catch (error) {
    console.log(colorText("Error:", LogColor.FgRed))
    console.log(colorText("Only 2 vald options are allowed:", LogColor.FgYellow))
    console.log(colorText(" --build \n --dev", LogColor.FgGreen))
}

