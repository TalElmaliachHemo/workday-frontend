import { useDispatch } from "react-redux"
import { useParams } from "react-router-dom"
import { useFormRegister } from "../../../hooks/useFormRegister.js"
import { removeGroup, updateGroup } from "../../../store/actions/board.action.js"
import { TaskList } from "../task/task-list.jsx"
import { GroupHeader } from "./group-header.jsx"
// ICONS
import { HiOutlineDotsHorizontal } from 'react-icons/hi' //More
import { MdDeleteOutline } from 'react-icons/md'//Delete
import { HiOutlineDocumentDuplicate } from 'react-icons/hi'//Duplicate
import { IoChevronDown } from 'react-icons/io5'
import { BiDotsHorizontalRounded } from "./group-header.jsx"
import { useState } from "react"

export const GroupPreview = ({ group, onChangeFilter }) => {
    const params = useParams()
    const dispatch = useDispatch()
    const [isDeleteBtnClicked, setBtnClicked] = useState(false)
    const [register, setNewGroup, newGroup] = useFormRegister({
        title: group.title
    })

    const onRemoveGroup = () => {
        const boardId = params.id
        dispatch(removeGroup(boardId, group.id))
    }

    const onUpdateGroup = (event) => {
        event.preventDefault()
        group.title = newGroup.title
        const boardId = params.id
        dispatch(updateGroup(boardId, group))
    }
    return (
        <section className="group-preview ">
            {/* Group Title  */}
            <div className="group-header-name heading-component flex  sticky-feature">
                <div className="dropdown">
                    <div ><HiOutlineDotsHorizontal className="dots" /></div>
                    <div className="dropdown-content">
                        <a onClick={onRemoveGroup}>< MdDeleteOutline /> Delete Gruop</a>
                        <a><HiOutlineDocumentDuplicate /> Duplicate</a>
                    </div>
                </div>
                {/* <div className="questModal">
                    {isDeleteBtnClicked && <AreYouSureModal toggleNewBoardModal={toggleNewBoardModal} onRemoveGroup={onRemoveGroup} />}

                </div> */}
                <div className=" flex sticky-feature">

                    <span className="collapse-group-button" style={{ color: `var(${group.colorId})` }}><IoChevronDown /></span>
                    <div className="group-title" >
                        <form onSubmit={onUpdateGroup}>
                            <input {...register('title', 'text')} className="group-name-input clean-input" style={{ color: `var(${group.colorId})` }} />
                        </form>
                    </div>
                    <span className="group-task-count">{`${group.tasks.length} items`}</span>
                </div>
            </div>
            {/* Group columns identifier (color, checkbox, task name, persons, status, priority....) */}
            <GroupHeader groupColor={group.colorId} onChangeFilter={onChangeFilter} />
            <TaskList tasks={group.tasks} groupId={group.id} groupColor={group.colorId} />
            {/* TODO <GroupFooter/> (Columns Summary) */}
        </section>
    )
}