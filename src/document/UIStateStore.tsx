import {
  Circle,
  Grid4x4,
  Route,
  Square,
  SquareOutlined,
} from "@mui/icons-material";
import { getRoot, Instance, types } from "mobx-state-tree";
import { ReactElement } from "react";
import Waypoint from "../assets/Waypoint";
import { constraints } from "./ConstraintStore";
import { IStateStore } from "./DocumentModel";
import {
  HolonomicWaypointStore,
  IHolonomicWaypointStore,
} from "./HolonomicWaypointStore";
import { IRobotConfigStore, RobotConfigStore } from "./RobotConfigStore";

export const SelectableItem = types.union(
  {
    dispatcher: (snapshot) => {
      if (snapshot.mass) return RobotConfigStore;
      return HolonomicWaypointStore;
    },
  },
  RobotConfigStore,
  HolonomicWaypointStore
);

/* Navbar stuff */
let NavbarData : {[key:string]: {
  index: number,
  name: string,
  icon: ReactElement
}} = {
  FullWaypoint: {
    index: 0,
    name: "Full Waypoint",
    icon: <Waypoint />,
  },
  TranslationWaypoint: {
    index: 1,
    name: "Translation Waypoint",
    icon: <Circle />,
  },
};
let constraintsIndices :number[] = [];
{
  let constraintsOffset = Object.keys(NavbarData).length;
  Object.entries(constraints).forEach(([key, data], index) => {
    NavbarData[key] = {index: constraintsOffset, name: data.name, icon: data.icon}
    constraintsIndices.push(constraintsOffset)
    constraintsOffset++;
  })
}


export const NavbarLabels = (() => {
  let x: { [key: string]: number } = {};
  Object.entries(NavbarData).forEach(([key, data], index) => {
    x[key] = index;
  });
  return x;
})();


export const NavbarItemData = (() => {
  let x: Array<{ name: string; icon: any }> = [];
  let constraintsOffset = 0;
  Object.entries(NavbarData).forEach(([key, data], index) => {
    x[data.index] = { name: data.name, icon: data.icon };
    constraintsOffset++;
  });
  return x;
})();
console.log(NavbarItemData)

export const NavbarItemSectionLengths = [1, 3]

export type SelectableItemTypes =
  | IRobotConfigStore
  | IHolonomicWaypointStore
  | undefined;

/* Visibility stuff */
const ViewData = {
  Field: {
    index: 0,
    name: "Field",
    icon: (
      <SquareOutlined style={{ transform: "scale(1.2, 0.6)" }}></SquareOutlined>
    ),
  },
  Grid: {
    index: 1,
    name: "Grid",
    icon: <Grid4x4 />,
  },
  Trajectory: {
    index: 2,
    name: "Trajectory",
    icon: <Route />,
  },
  Waypoints: {
    index: 3,
    name: "Waypoints",
    icon: <Waypoint />,
  },
};

export const ViewLayers = (() => {
  let x: { [key: string]: number } = {};
  Object.entries(ViewData).forEach(([key, data], index) => {
    x[key] = index;
  });
  return x;
})();

export const ViewItemData = (() => {
  let x: Array<{ name: string; icon: any }> = [];
  Object.entries(ViewData).forEach(([key, data], index) => {
    x[data.index] = { name: data.name, icon: data.icon };
  });
  return x;
})();

export type ViewLayerType = typeof ViewLayers;
export const UIStateStore = types
  .model("UIStateStore", {
    fieldScalingFactor: 0.02,
    saveFileName: "save",
    waypointPanelOpen: false,
    visibilityPanelOpen: false,
    mainMenuOpen: false,
    pathAnimationTimestamp: 0,
    layers: types.array(types.boolean),
    selectedSidebarItem: types.maybe(types.safeReference(SelectableItem)),
    selectedNavbarItem: NavbarLabels.FullWaypoint,
  })
  .views((self: any) => {
    return {
      isNavbarWaypointSelected() {
        return (
          self.selectedNavbarItem == NavbarLabels.FullWaypoint ||
          self.selectedNavbarItem == NavbarLabels.TranslationWaypoint
        );
      },
      isConstraintSelected() {
        return (
          (self.selectedNavbarItem > NavbarItemSectionLengths[0]) &&
          (self.selectedNavbarItem <= NavbarItemSectionLengths[1])
        )
      },
      visibleLayersOnly() {
        return self.layers.flatMap((visible: boolean, index: number) => {
          if (visible) {
            return [index];
          }
          return [];
        });
      },
    };
  })
  .actions((self: any) => ({
    setMainMenuOpen(open: boolean) {
      self.mainMenuOpen = open;
    },
    toggleMainMenu() {
      self.mainMenuOpen = !self.mainMenuOpen;
    },
    setFieldScalingFactor(metersPerPixel: number) {
      self.fieldScalingFactor = metersPerPixel;
    },
    setSaveFileName(name: string) {
      self.saveFileName = name;
    },
    setWaypointPanelOpen(open: boolean) {
      self.waypointPanelOpen = open;
    },
    setVisibilityPanelOpen(open: boolean) {
      self.visibilityPanelOpen = open;
    },
    setPathAnimationTimestamp(time: number) {
      self.pathAnimationTimestamp = time;
    },
    setSelectedSidebarItem(item: SelectableItemTypes) {
      self.selectedSidebarItem = item;
    },
    setLayerVisible(layer: number, visible: boolean) {
      self.layers.length = Math.max(layer + 1, self.layers.length);
      self.layers[layer] = visible;
    },
    setVisibleLayers(visibleLayers: number[]) {
      self.layers.fill(false);
      visibleLayers.forEach((layer) => {
        self.layers.length = Math.max(layer + 1, self.layers.length);
        self.layers[layer] = true;
      });
    },
    setSelectedNavbarItem(item: number) {
      self.selectedNavbarItem = item;
    },
  }));
export interface IUIStateStore extends Instance<typeof UIStateStore> {}
