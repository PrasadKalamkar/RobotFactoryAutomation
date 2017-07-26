import * as React from 'react';
import * as style from './style.css';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import PropTypes from 'prop-types';
import { RootState } from '../../reducers';
import { Header, MainSection } from '../../components';
import * as actions from '../../actions/RobotAction';
import { Robot } from '../../components/Robot';
import {checkQualityForExtinguish, 
        performCheckForRecycle, 
        findFactorySecondRobots, 
        getFactorySecondRobots, 
        getQualityPassedRobots, 
        getReadyToShipRobots} from '../..//utils/utility';

export namespace App {
  export interface Props extends RouteComponentProps<void> {
    actions: PropTypes.func,
    robot: PropTypes.array,
    factorySecondRobots: PropTypes.array,
    qualityPassedRobots: PropTypes.array,
    readyToShipRobots: PropTypes.array
  }

  export interface State {
    /* empty */
  }
}

@connect(mapStateToProps, mapDispatchToProps)
export class App extends React.Component<App.Props, App.State> {
  constructor(props?: App.Props, context?: any) {
    super(props, context);
    this.initiateQualityProcess = this.initiateQualityProcess.bind(this);
    this.startShippingProcess = this.startShippingProcess.bind(this);
    this.removeFromShipment = this.removeFromShipment.bind(this);
    this.sendShipment = this.sendShipment.bind(this);
  }

  initiateQualityProcess() {
        if (this.props.robot !== undefined) {
            const robotsToBeExtiguished = checkQualityForExtinguish(this.props.robot);

            if (robotsToBeExtiguished !== undefined && robotsToBeExtiguished.length > 0) {
                for (let i = 0; i < robotsToBeExtiguished.length; i++) {
                this.props.actions.extinguishRobot(robotsToBeExtiguished[i]);
                this.props.actions.saveExtinguishRobot(robotsToBeExtiguished[i]); 
                }
            }

            const robotsToBeRecycled = performCheckForRecycle(this.props.robot);
            if (robotsToBeRecycled !== undefined && robotsToBeRecycled.length > 0) {
                let robotIds = [];
                let robotIdToRecycleList = [];
                for (let i = 0; i < robotsToBeRecycled.length; i++) {                    
                    robotIds.push(robotsToBeRecycled[i].id);
                    const robotIdObject = {"robotId": robotsToBeRecycled[i].id};
                    robotIdToRecycleList.push(robotIdObject);
                }
                this.props.actions.recycleRobot(robotIds);
                this.props.actions.saveRecycleRobot({"robots": robotIdToRecycleList});
            } 

            const factorySecondRobots = findFactorySecondRobots(this.props.robot);
            if (factorySecondRobots !== undefined && factorySecondRobots.length > 0) {
                let robotIds = [];
                for (let i = 0; i < factorySecondRobots.length; i++) {                    
                    robotIds.push(factorySecondRobots[i].id);                    
                }
                this.props.actions.factorySecondRobot(robotIds);
            }      
        } 
    }

    startShippingProcess(e) {
        const robotId = e.target.id;
        if (robotId !== undefined) {
            this.props.actions.shipRobot(parseInt(robotId));
        }        
    }

    removeFromShipment(e) {
        const robotId = e.target.id;
        if (robotId !== undefined) {
            this.props.actions.removeShipRobot(parseInt(robotId));
        }        
    }

    sendShipment() {
        const robotsToBeShipped = getReadyToShipRobots(this.props.robot);
            if (robotsToBeShipped !== undefined && robotsToBeShipped.length > 0) {
                let robotIds = [];
                let robotIdListForSubmit = [];
                for (let i = 0; i < robotsToBeShipped.length; i++) {                    
                    robotIds.push(robotsToBeShipped[i].id);
                    const robotIdObject = {"robotId": robotsToBeShipped[i].id};
                    robotIdListForSubmit.push(robotIdObject);
                }
                this.props.actions.submitShipment(robotIds);
                this.props.actions.saveShipment({"robots": robotIdListForSubmit});
            }
    }

  render() {
        const {robot, factorySecondRobots, qualityPassedRobots, readyToShipRobots} = this.props;                
        
        return (
            <div>                
        {
            robot !== undefined && robot.length > 0 ?
            <div>
                <button type="button" onClick={this.initiateQualityProcess} style={{"marginLeft": "1000px"}}>Start Quality</button>	
                <h3> All Robots </h3>
                    <Robot robots={robot} startProcess={undefined} showActionColumn={undefined} actionName="undefined" />
            </div> : ''
        }            
        {
            factorySecondRobots !== undefined && factorySecondRobots.length > 0 ?
                <div>
                    <h3> Factory Second Robots </h3> 
                    <Robot robots={factorySecondRobots} startProcess={this.startShippingProcess} showActionColumn={true} actionName="Ready To Ship" />
                </div> : ''
        }
        {
            qualityPassedRobots !== undefined && qualityPassedRobots.length > 0 && robot.length !== qualityPassedRobots.length ?
                <div>
                    <h3> Quality Passed Robots </h3> 
                    <Robot robots={qualityPassedRobots} startProcess={this.startShippingProcess} showActionColumn={true} actionName="Ready To Ship" />
                </div> : ''
        }
        {
            readyToShipRobots !== undefined && readyToShipRobots.length > 0 ?
                <div>
                    <h3> Ready to Ship Robots </h3> 
                    <Robot robots={readyToShipRobots} startProcess={this.removeFromShipment} showActionColumn={true} actionName="Remove From Shipment" />
                    <br />
                    <input type="button" value ="Send Shipment" style={{"marginLeft": "1000px"}} onClick={this.sendShipment} />
                </div> : ''
        }
        </div>
        );
    }
}

function mapStateToProps(state) {   
    let factorySecondRobots = state.RobotReducer !== undefined && state.RobotReducer.length > 0 ? getFactorySecondRobots(state.RobotReducer) : undefined;
    let qualityPassedRobots = state.RobotReducer !== undefined && state.RobotReducer.length > 0 ? getQualityPassedRobots(state.RobotReducer) : undefined;
    let readyToShipRobots = state.RobotReducer !== undefined && state.RobotReducer.length > 0 ? getReadyToShipRobots(state.RobotReducer) : undefined;
    return {
        robot: state.RobotReducer,
        factorySecondRobots: factorySecondRobots,
        qualityPassedRobots: qualityPassedRobots,
        readyToShipRobots: readyToShipRobots
    };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions as any, dispatch)
  };
}
