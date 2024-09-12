import RedirectComponent from "../../component/RedirectComponent.js";
import Page from "./PageView.js"

export default async function Redirect() {
    await RedirectComponent();
    return <Page/>
}