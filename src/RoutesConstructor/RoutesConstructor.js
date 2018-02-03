import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import RoutesConstructorMap from './RoutesConstructorMap';
import {
	SortableContainer,
	SortableElement,
	SortableHandle,
	arrayMove
} from 'react-sortable-hoc';
import './RoutesConstructor.css';

class RoutesConstructor extends Component {
	__resizeTimeout=0;

	constructor(props){
		super(props);

		this.state={
			points:props.points||[]
		};

		this.createMarker=this.createMarker.bind(this);
	}

	render(){
		const DragHandle=SortableHandle(
				({title})=><span className="title">{title}</span>
			),
			SortableItem=SortableElement(
				({item})=>
					<div className="point-list__item">
						<DragHandle title={item.title}/>
						<span className="remove" onClick={(e)=>this.removeMarker(item.id,e)}/>
					</div>
			),
			SortableList=SortableContainer(
				({points})=>
					<div className="point-list">
						{points.map((item)=>(
							<SortableItem key={item.id} index={item.index} item={item}/>
						))}
					</div>
			);

		this.handleWinResize();

		return (
			<div className="routes-constructor" ref="routesConstructor">
				<div className="left-side">
					<form onSubmit={this.createMarker} method="post">
						<div>
							<div className="input">
								<input type="text"
								       ref="markerName"
								       defaultValue=""
								       placeholder="Новая точка маршрута"/>
							</div>
							<SortableList
								points={this.state.points}
								onSortEnd={this.onSortEnd}
								useDragHandle={true}/>
						</div>
					</form>
				</div>
				<div className="right-side">
					<RoutesConstructorMap markers={this.state.points}/>
				</div>
			</div>
		);
	}

	onSortEnd=({oldIndex,newIndex})=>{
		this.setState({
			points:arrayMove(this.state.points,oldIndex,newIndex)
				.map((item,i)=>{
					item.index=i;

					return item;
				})
		});
	};

	componentDidMount(){
		this.handleWinResize();

		window.addEventListener('resize',this.handleWinResize.bind(this));
	}
	componentWillUnmount(){
		window.removeEventListener('resize',this.handleWinResize.bind(this));
	}

	handleWinResize(){
		clearTimeout(this.__resizeTimeout);

		this.__resizeTimeout=setTimeout(()=>{
			let Node=ReactDOM.findDOMNode(this.refs.routesConstructor),
				Style=Node.style;

			Style.cssText='width:100vw;height:100vh;';
			if(Style.height!=='100vh')
				Style.cssText=`width:${document.body.offsetWidth}px;`
					+`height:${document.body.offsetHeight}px;`;

			let cont=Node.querySelector('.left-side'),
				pointList=cont.querySelector('.point-list');

			pointList.style.height=(Node.clientHeight-cont.clientHeight+pointList.clientHeight)+'px';
		},50);
	}

	createMarker(e){
		e.preventDefault();

		var Node=ReactDOM.findDOMNode(this.refs.markerName);
		if(!Node.value.trim().length)
			return;

		var Point={
			id:(new Date()).getTime()+Math.random(),
			title:Node.value.trim(),
			position:window.__Map.getCenter(),
			index:this.state.points.length
		};

		this.setState({
			points:this.state.points.concat(Point)
		});

		Node.value='';
	}

	removeMarker(id,e){
		e.stopPropagation();

		this.setState({
			points:this.state.points.filter(item=>item.id!==id)
		});
	}
}

export default RoutesConstructor;