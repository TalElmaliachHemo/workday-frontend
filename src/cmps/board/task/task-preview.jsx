import React, { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link, useParams } from "react-router-dom"

import { AreYouSureModal } from "./are-you-sure-modal.jsx"
import { utilService } from "../../../services/util.service.js"
import { addTask, removeTask, updateStatusOrPiority, updateTask } from "../../../store/actions/board.action.js"
import { useFormRegister } from "../../../hooks/useFormRegister.js"
import { StatusTypeDisplay } from "../task/status-display.jsx"
import { AvatarsChain } from "../../avatarsChain.jsx"
import { LastUpdated } from "../task/last-updated.jsx"
// ICONS
import { RiArrowRightSLine } from 'react-icons/ri' //subitem
import { TbArrowsDiagonal } from 'react-icons/tb' //open item
import { HiOutlineDotsHorizontal } from 'react-icons/hi' //More
import { MdDeleteOutline } from 'react-icons/md'//Delete
import { HiOutlineDocumentDuplicate } from 'react-icons/hi'//Duplicate
import { ReactComponent as NoneUpdatesIcon } from '../../../assets/svgs/NoneUpdatesIcon.svg'
import { TimeLine } from "../../time-line.jsx"


export const TaskPreview = ({ task, groupId, groupColor, provided }) => {
    const labels = useSelector(state => state.boardModule.selectedBoard.labels)
    const board = useSelector(state => state.boardModule.selectedBoard)
    const [isDeleteBtnClicked, setBtnClicked] = useState(false)
    const dispatch = useDispatch()
    const params = useParams()
    const boardId = params.id


    const [register, setNewTask, newTask] = useFormRegister({
        title: task.title
    })

    const onRemoveTask = () => {
        toggleNewBoardModal()
        dispatch(removeTask(boardId, groupId, task.id))
    }

    const onUpdateTask = (event) => {
        event.preventDefault()
        task.title = newTask.title
        task.lastUpdated = Date.now()
        dispatch(updateTask(boardId, groupId, task))
    }

    const onDuplicateTask = () => {
        const duplicateTask = { ...task }
        duplicateTask.id = utilService.makeId()
        duplicateTask.lastUpdated = Date.now()
        duplicateTask.comments = [...task.comments]
        // if (duplicateTask.comments || duplicateTask.comments.length) {
        //     duplicateTask.comments.forEach(comment => comment.id = utilService.makeId())
        // }
        dispatch(addTask(boardId, groupId, duplicateTask))
    }

    const setStatusOrPriority = (currStatusOrPriority, label) => {
        if (label === 'priority') {
            const taskToUpdate = { ...task, priority: currStatusOrPriority }
            dispatch(updateStatusOrPiority(boardId, groupId, taskToUpdate))
        }
        else if (label === 'status') {
            const taskToUpdate = { ...task, status: currStatusOrPriority }
            dispatch(updateStatusOrPiority(boardId, groupId, taskToUpdate))
        }
    }

    const toggleNewBoardModal = () => {
        setBtnClicked(!isDeleteBtnClicked)
    }

    const { persons, lastUpdated, deadline } = task
    let date = (deadline) ? new Date(deadline) : ''
    return (
        // <div className="preview-full-task flex" {...provided.dragHandleProps} {...provided.draggableProps} ref={provided.innerRef}>
        <div className="preview-full-task flex">
            <div className="dropdown">
                <div ><HiOutlineDotsHorizontal className="dot" /></div>
                <div className="dropdown-content">
                    <a onClick={toggleNewBoardModal}>< MdDeleteOutline /> Delete Item</a>
                    <a onClick={onDuplicateTask}><HiOutlineDocumentDuplicate /> Duplicate</a>
                </div>
            </div>
            <div className="questModal\questions">
                {isDeleteBtnClicked && <AreYouSureModal toggleNewBoardModal={toggleNewBoardModal} onRemoveEntity={onRemoveTask} />}
            </div>
            <section className="task-preview flex">
                <div className="cell task-name-area sticky-feature flex">
                    <div className="task-group-color" style={{ backgroundColor: `var(${groupColor})`, borderBlock: `0.5px solid var(${groupColor})` }}></div>
                    <div className="preview-checkbox"><input className="input-checkbox" type="checkbox" name="" id="" /></div>
                    <div className="btn-subitem"><RiArrowRightSLine className="subitem-icon" /></div>
                    <div className="task-name-heading">
                        <form className="editable-heading" onSubmit={onUpdateTask}>
                            <input className="clean-input" {...register('title', 'text')} />
                        </form>
                    </div>
                    <Link to={`/board/${params.id}/${groupId}/${task.id}`} className="btn-open-link">
                        <div className="btn-open-task flex"><TbArrowsDiagonal className="open-icon" /> <span className="open-txt"> Open </span></div>
                    </Link>
                    <Link to={`/board/${params.id}/${groupId}/${task.id}`} className="btn-update-link">
                        <div className="btn-updates-count"><NoneUpdatesIcon /></div>
                    </Link>

                </div>

                {/* Persons / Responsbility */}
                <div className="cell persons-header"> {typeof persons === 'object' && <AvatarsChain task={task} groupId={groupId} assigneeMembers={persons} />}</div>

                {/* ALL Label Type Columns (Status + Priority) */}
                {labels && labels.map(label => {
                    const labelName = label.name
                    const labelValue = task[labelName]
                    return <StatusTypeDisplay setStatusOrPriority={setStatusOrPriority} key={label.name} label={`${label.name}`} value={labelValue} options={label.options} />
                })}

                {/* DeadLine */}
                <LastUpdated lastUpdated={lastUpdated} />

                {/* TimeLine */}
                <div className="cell timeline-header">
                  { task.timeline && <TimeLine task={task} boardId={boardId} groupId={groupId} groupColor={groupColor}/>}
                </div>

                {/* Due Date */}
                {date && <div className="cell date-header">
                    {date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear()}
                </div>}
                {!date && <div className="cell date-header"></div>}
                {/* Empty column */}
                <div className="cell add-column"></div>
            </section>
        </div>
    )
}