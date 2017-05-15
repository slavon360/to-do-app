var helper = (function(){
	var currentDateGl,
	task;
	var agendaCreation=function(totalGridItems,weekdays,agendaGrid){
		for(var i=0;i<totalGridItems;i++){
			var gridItem=document.createElement('DIV');
			gridItem.className='grid-item';
			weekdays[i] ? gridItem.setAttribute('data-weekday',weekdays[i]) : gridItem.setAttribute('data-weekday',weekdays[i%weekdays.length]);
			agendaGrid.appendChild(gridItem)
		}
	};
	var createTask=function(outerValues,dateObj){
		currentDateGl=outerValues.currentAttrValue;
		task={taskDate:dateObj.formatDayMonthDate(outerValues.currentAttrValue)};
		//console.log(task)
		outerValues.createTaskModal.style.display="block";
		outerValues.modalTaskDate.innerHTML=task.taskDate;  
	}
	var createTaskModal=function(element,modalCreateTaskTitle,modalCreateTaskNote){
		element.addEventListener('click',function(e){
			if(e.target.className==='create-task-wrp'){
				modalCreateTaskTitle.value="";
				modalCreateTaskNote.value="";
				element.style.display="none";
			}
		});
	}
	var editTaskModal=function(element){
		element.addEventListener('click',function(e){
			if(e.target.className==='edit-task-wrp'){
				element.style.display="none";
			}
		});
	}
	var btnCreate=function(outerValues){
		var locStor=localStorage.getItem('tasks');
		outerValues.btnCreate.addEventListener('click',function(){
			var currentItem=document.querySelectorAll('[data-currentdate="'+currentDateGl+'"]');
			if(outerValues.modalCreateTaskTitle.value !== '' && outerValues.modalCreateTaskNote.value !== ''){
				task.taskTitle=outerValues.modalCreateTaskTitle.value;
				task.taskNote=outerValues.modalCreateTaskNote.value;
				task.taskDateNumber=currentDateGl;
				currentItem[0].setAttribute('data-task-note',task.taskNote);
				currentItem[0].setAttribute('data-task-date',task.taskDate);
				currentItem[0].setAttribute('data-task-title',outerValues.editWord+'"'+task.taskTitle+'"');
				currentItem[0].innerHTML+='    <br/>'+task.taskTitle;
				outerValues.modalCreateTaskTitle.value="";
				outerValues.modalCreateTaskNote.value="";
				outerValues.createTaskModal.style.display="none";
				if(!locStor){
					locStor=JSON.stringify([task])
					localStorage.setItem('tasks',locStor);
				}else if(locStor){
					var updTasks=JSON.parse(localStorage.getItem('tasks'));
					updTasks.push(task);
					localStorage.setItem('tasks',JSON.stringify(updTasks));
					console.log(updTasks)
				}
			}
		})
	}
	var editTask=function(outerValues,currentGridItem,task){
		var updEditWord=new RegExp(outerValues.editWord+'|"','gi');
		outerValues.modalEditTaskDate.setAttribute('data-currentdate',currentGridItem.getAttribute('data-currentdate'));
		outerValues.modalEditTaskDate.innerHTML=currentGridItem.getAttribute('data-task-date');
		outerValues.modalEditTaskTitle.value=currentGridItem.getAttribute('data-task-title').replace(updEditWord,'');
		outerValues.modalEditTaskNote.value=currentGridItem.getAttribute('data-task-note');
		outerValues.editTaskModal.style.display="block";
	}
	var retrieveItemFromLocStor=function(localTasks,currentDay){
		return localTasks.filter(function(item){
			return (+item.taskDateNumber)===currentDay 
		})[0];
	}
	var updatedTasks=function(localTasks,currentDay,outerValues){
		return localTasks.reduce(function(result,current){
			if(current.taskDateNumber===currentDay){
				current.taskTitle=outerValues.taskTitle.value;
				current.taskNote=outerValues.taskNote.value;
				console.log(current)
			}
			result.push(current);
			return result
		},[])
	}
	var updatedTasksDel=function(localTasks,currentDay){
		return localTasks.filter(function(item){
			return item.taskDateNumber!==currentDay;
		})
	}
		var updateTask=function(outerValues){
		outerValues.btnSave.addEventListener('click',function(){
			var taskNumber=outerValues.modalEditTaskDate.getAttribute('data-currentdate'),
			    taskTitle=outerValues.modalEditTaskTitle,
			    taskNote=outerValues.modalEditTaskNote,
			    taskToUpdate=updatedTasks(JSON.parse(localStorage.getItem('tasks')),taskNumber,{
			    taskTitle:outerValues.modalEditTaskTitle,
			    taskNote:outerValues.modalEditTaskNote
			    });
			    var itemToUpdate=document.querySelectorAll('[data-currentdate="'+taskNumber+'"]')[0];
			    itemToUpdate.setAttribute('data-task-title',outerValues.editWord+'"'+taskTitle.value+'"');
			    itemToUpdate.setAttribute('data-task-note',taskNote.value);
			    itemToUpdate.innerHTML=taskNumber+'    <br/>'+taskTitle.value;
			    localStorage.setItem('tasks',JSON.stringify(taskToUpdate));
			    outerValues.editTaskModal.style.display="none";
		})
	}
	var deleteTask=function(outerValues){
		outerValues.btnDelete.addEventListener('click',function(){
			var taskNumber=outerValues.modalEditTaskDate.getAttribute('data-currentdate'),
			    taskToUpdate=updatedTasksDel(JSON.parse(localStorage.getItem('tasks')),taskNumber);
			    var itemToUpdate=document.querySelectorAll('[data-currentdate="'+taskNumber+'"]')[0];
			    itemToUpdate.setAttribute('data-task-title','create task');
			    itemToUpdate.innerHTML=itemToUpdate.innerHTML.slice(0,5);
			    localStorage.setItem('tasks',JSON.stringify(taskToUpdate));
			    outerValues.editTaskModal.style.display="none";
		})
	}
	var fillAgenda=function(dateObj,outerValues){
		var gridItems=document.getElementsByClassName('grid-item'),
		localStorTasks=localStorage.getItem('tasks'),
		gridItemsArray=[].slice.call(gridItems),
		currentDay=0,
		previousMonthsDays=0,
		previousMonthsDaysArr=[],
		nextMonthsDay=0;
		allow=false;
		gridItemsArray.forEach(function(item){
			if(currentDay<dateObj.lastDate && (allow || item.getAttribute('data-weekday') === dateObj.firstDayOfWeek)){
				currentDay++;
				currentDay === 1 ? item.innerHTML=outerValues.monthNames[dateObj.currentMonth]+' ' : '';
				item.innerHTML+=currentDay;
				item.setAttribute('data-currentdate',currentDay);
				if(localStorTasks){
					var localTasks=JSON.parse(localStorTasks);
					var existedTask=retrieveItemFromLocStor(localTasks,currentDay);
					if(existedTask){
						item.setAttribute('data-task-title','edit task '+existedTask.taskTitle);
						item.setAttribute('data-task-note',existedTask.taskNote);
						item.setAttribute('data-task-date',existedTask.taskDate);
						item.innerHTML=item.innerHTML+'    <br/>'+existedTask.taskTitle;
					}else{
						item.setAttribute('data-task-title','create task');	
					}
				}
				if(!localStorTasks){
					item.setAttribute('data-task-title','create task');
				}
				allow=true;
				if(currentDay===dateObj.currentDate){
					item.className += " current-date";
				}
			}else if(allow){
				nextMonthsDay++;
				nextMonthsDay === 1 ? item.innerHTML=outerValues.monthNames[dateObj.currentMonth+1]+' ' : '';
				item.innerHTML+=nextMonthsDay;
				item.style.opacity=0.5;
			}
			else if(!allow){
				previousMonthsDaysArr.unshift(dateObj.previousMonthsDay-(previousMonthsDays++));
				item.style.opacity=0.5;
			}
			item.addEventListener('click',function(e){
				outerValues.currentAttrValue=e.target.getAttribute('data-currentdate');
				if(e.target.getAttribute('data-task-title') === 'create task'){
					createTask(outerValues, dateObj);
				}else if(e.target.getAttribute('data-currentdate')){
					editTask(outerValues,item,task);      
				}
			})
		})
		previousMonthsDaysArr.forEach(function(item,index){
			gridItemsArray[index].innerHTML=item
		})
	};
	return{
		agendaCreation:agendaCreation,
		createTaskModal:createTaskModal,
		editTaskModal:editTaskModal,
		btnCreate:btnCreate,
		createTask:createTask,
		editTask:editTask,
		fillAgenda:fillAgenda,
		updateTask:updateTask,
		deleteTask:deleteTask
	}
})();