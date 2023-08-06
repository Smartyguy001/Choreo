import React, { Component } from "react";
import DocumentManagerContext from "../../../document/DocumentManager";

import { observer } from "mobx-react";
import { ConstraintStore } from "../../../document/ConstraintStore";

type Props = {};

type State = {};

class FieldConstraintsAddLayer extends Component<Props, State> {
  static contextType = DocumentManagerContext;
  context!: React.ContextType<typeof DocumentManagerContext>;
  state = {};

  render() {
    let activePath = this.context.model.document.pathlist.activePath
    let selectedConstraint = this.context.model.uiState.getSelectedConstraint()
    let selectedConstraintDefinition = this.context.model.uiState.getSelectedConstraintDefinition();
    return (
      <>
      { selectedConstraintDefinition!.wptScope &&
        activePath.waypoints.map(
          (point, index) => {
            return (
              
              <circle
                key={index}
                cx={point.x}
                cy={point.y}
                r={0.2}
                fill={"black"}
                fillOpacity={0.2}
                stroke="white"
                strokeWidth={0.05}
                onClick={()=>{
                  let constraintToAdd = selectedConstraint;
                  let newConstraint = activePath.addConstraint(
                    constraintToAdd
                  )
                  console.log(JSON.stringify(newConstraint))

                  if (newConstraint !== undefined) {
                    console.log(newConstraint.wptScope)
                    if (newConstraint.wptScope) {
                      newConstraint.setScope(point.uuid)
                    }
                  }
                  console.log(JSON.stringify(newConstraint))
                  console.log(activePath.asSavedPath())
                }}
              ></circle>
            
            );
          }
        )
      }
      { selectedConstraintDefinition!.sgmtScope &&
        activePath.waypoints.slice(0, activePath.waypoints.length-1).map(
          (point1, index) => {
            let point2 = activePath.waypoints[index + 1];
            return (
              
              <circle
                key={`${index}-${index+1}`}
                cx={(point1.x + point2.x)/2}
                cy={(point1.y + point2.y)/2}
                r={0.2}
                fill={"black"}
                fillOpacity={0.2}
                stroke="white"
                strokeWidth={0.05}
                onClick={()=>{
                  let constraintToAdd = this.context.model.uiState.getSelectedConstraint()
                  let newConstraint = activePath.addConstraint(
                    constraintToAdd
                  )
                  console.log(JSON.stringify(newConstraint))

                  if (newConstraint !== undefined) {
                    console.log(newConstraint.wptScope)
                    if (newConstraint.wptScope) {
                      newConstraint.setScope({start: point1.uuid, end: point2.uuid})
                    }
                  }
                  console.log(JSON.stringify(newConstraint))
                  console.log(activePath.asSavedPath())
                }}
              ></circle>
            
            );
          }
        )
      }

      { selectedConstraintDefinition!.fullPathScope &&
             <>
             <line
              x1 = {activePath.waypoints[0].x}
              x2 = {activePath.waypoints[activePath.waypoints.length-1].x}
              y1 = {activePath.waypoints[0].y}
              y2 = {activePath.waypoints[activePath.waypoints.length-1].y}
              strokeDasharray={0.2}
              stroke = "white"
              strokeWidth={0.05}
             ></line>
              <circle
                key={`full`}
                cx={(activePath.waypoints[0].x + activePath.waypoints[activePath.waypoints.length-1].x)/2}
                cy={(activePath.waypoints[0].y + activePath.waypoints[activePath.waypoints.length-1].y)/2}
                r={0.2}
                fill={"black"}
                fillOpacity={0.2}
                stroke="white"
                strokeWidth={0.05}
                onClick={()=>{
                  let constraintToAdd = this.context.model.uiState.getSelectedConstraint()
                  let newConstraint = activePath.addConstraint(
                    constraintToAdd
                  )
                  console.log(JSON.stringify(newConstraint))

                  if (newConstraint !== undefined) {
                    console.log(newConstraint.definition.fullPathScope)
                    if (newConstraint.definition.fullPathScope) {
                      newConstraint.setScope("full")
                    }
                  }
                  console.log(JSON.stringify(newConstraint))
                  console.log(activePath.asSavedPath())
                }}
              ></circle>
            </>
  
      }

      </>
    );
    

  }
}
export default observer(FieldConstraintsAddLayer);
