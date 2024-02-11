const router = new Bun.FileSystemRouter({
    style: "nextjs",
    dir: "./backend",
    origin: "",
    assetPrefix: ""
});
router.match("/");
const server = (root: string) => {
    console.log("Starting server")
    console.log(router.match(root));

}



export default server