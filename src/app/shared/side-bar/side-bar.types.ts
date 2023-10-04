import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { Access } from "src/app/user/access-modal/access.type";

export interface SideBarElement {
    id?: string;
    type: string;
    routerLink?: string;
    icon: IconProp;
    label: string;
    accessRequired: Access[];
}
