    var moduleHelper=helper;     
    (function(){
	 //weekdays header//
    var weekdays=new Array(7);
    weekdays[0] = "Sunday";
    weekdays[1] = "Monday";
    weekdays[2] = "Tuesday";
    weekdays[3] = "Wednesday";
    weekdays[4] = "Thursday";
    weekdays[5] = "Friday";
    weekdays[6] = "Saturday";
    var monthNames=["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
    ];
    var daysOfWeek=document.getElementById('weekdays'),
    currentAttrValue,
    editWord='edit task ',
    totalGridItems=42,
    createTaskModal=document.getElementById('create-task-modal'),
    editTaskModal=document.getElementById('edit-task-modal'),
    modalTaskDate=document.getElementById('date'),
    modalEditTaskDate=document.getElementById('edit-task-date'),
    modalEditTaskTitle=document.getElementById('edit-task-title'),
    modalEditTaskNote=document.getElementById('edit-task-dscrpt'),
    btnSave=document.getElementById('close-save'),
    modalCreateTaskTitle=document.getElementById('task-title'),
    modalCreateTaskNote=document.getElementById('task-note'),
    btnDelete=document.getElementById('delete'),
    btnCreate=document.getElementById('btn-create'),
    agendaGrid=document.getElementById('agenda-grid');
    weekdays.forEach(function(item){
       var day=document.createElement('DIV');
       day.className='weekday';
       day.appendChild(document.createTextNode(item));
       daysOfWeek.appendChild(day);	
   });
    //total number of days
    var dateObj={};
    (function(){
        var date=new Date();
        dateObj.lastDate=new Date(date.getFullYear(),date.getMonth()+1,0).getDate();
        dateObj.firstDayOfWeek=weekdays[new Date(date.getFullYear(),date.getMonth(),1).getDay()];
        dateObj.previousMonthsDay=new Date(date.getFullYear(),date.getMonth(),0).getDate();
        dateObj.currentDate=date.getDate();
        dateObj.currentMonth=date.getMonth();
        dateObj.formatDayMonthDate=function(choosedDate){
            var value=new Date(date.getFullYear(),date.getMonth(),choosedDate);
            return value.toString().replace(' ',',').slice(0,10);
        }
    })();
    var task={};
    console.log(dateObj);
    //create grid of agenda
    moduleHelper.agendaCreation(totalGridItems,weekdays,agendaGrid);
    //fill agenda with days
    moduleHelper.fillAgenda(dateObj,
        {monthNames:monthNames,
            currentAttrValue:currentAttrValue,
            createTaskModal:createTaskModal,
            modalTaskDate:modalTaskDate,
            editWord:editWord,
            modalEditTaskDate:modalEditTaskDate,
            modalEditTaskTitle:modalEditTaskTitle,
            modalEditTaskNote:modalEditTaskNote,
            editTaskModal:editTaskModal,
            btnCreate:btnCreate,
            modalCreateTaskTitle:modalCreateTaskTitle,
            modalCreateTaskNote:modalCreateTaskNote
        });
    //click events logic
    var gridItems=document.getElementsByClassName('grid-item');
    moduleHelper.createTaskModal(createTaskModal,modalCreateTaskTitle,modalCreateTaskNote);
    moduleHelper.editTaskModal(editTaskModal);
    moduleHelper.btnCreate({btnCreate:btnCreate,
            modalCreateTaskTitle:modalCreateTaskTitle,
            modalCreateTaskNote:modalCreateTaskNote,
            createTaskModal:createTaskModal,
            editWord:editWord,
            dateObj:dateObj});
    moduleHelper.updateTask({btnSave:btnSave,
        modalEditTaskDate:modalEditTaskDate,
        modalEditTaskTitle:modalEditTaskTitle,
        modalEditTaskNote:modalEditTaskNote,
        editWord:editWord,
        editTaskModal:editTaskModal})
    moduleHelper.deleteTask({
        btnDelete:btnDelete,
        modalEditTaskDate:modalEditTaskDate,
        editWord:editWord,
        editTaskModal:editTaskModal
    })
})()