import { IoIosArrowDown } from 'react-icons/io' //New item
import { FaRegUserCircle } from 'react-icons/fa' //Person
import { CgArrowsScrollV } from 'react-icons/cg' //Sort
import { BiFilterAlt } from 'react-icons/bi'//Filter
import { AiOutlineEyeInvisible } from 'react-icons/ai'//Hide
import { HiOutlineDotsHorizontal } from 'react-icons/hi' //More
import { AiOutlinePlusCircle } from 'react-icons/ai' //Plus
import { HiOutlineInbox } from 'react-icons/hi' //box
import { useDispatch } from "react-redux"
import { addTask } from "../../../store/actions/board.action.js"
import { useState } from "react"
import { Search } from "../../search.jsx"
import { FilterBoardByType } from './board-filter.jsx';
import { utilService } from '../../../services/util.service.js';

//IoHomeOutline - Main Table
//RiErrorWarningLine - description
//AiOutlineStar - starred
//FaSort - Sort on group
//HiFolder - new item
//TbArrowsDiagonal - open item
//BiMessageRoundedAdd - empty updates
//BiMessageRounded - with updates 
//IoIosCheckmarkCircleOutline -checklist 


export function ViewbarBoardHeader({ board, onAddGroup, onChangeFilter }) {
    // const [isSearch, setSearch] = useState(false)
    const [isFilter, setFilter] = useState(false)

    const dispatch = useDispatch()

    const onAddTask = () => {
        let task = { title: 'New Item' }
        task = createTask(task)
        dispatch(addTask(board.id, board.groups[0].id, task))
    }

    const createTask = (task) => {
        task.id = utilService.makeId()
        task.status = ''
        task.priority = ''
        task.persons = ''
        task.deadLine = ''
        task.lastUpdate = Date.now()
        return task
    }

    return (
        <div className="board-header-view-bar flex ">
            <div className="new-item-btn flex ">
                <button onClick={onAddTask} className="view-nav-btn btn">New Item</button>
                <section className="dropdown">
                    <button className="view-nav-btn-arrow">< IoIosArrowDown className="arrow-down" /></button>
                    <div className="dropdown-content flex column ">
                        <i onClick={onAddTask}> <AiOutlinePlusCircle className="dropdown-icon" /> <span>Add new Item</span></i>
                        <i onClick={onAddGroup}> <HiOutlineInbox className="dropdown-icon" /><span>New group of Items</span></i>
                    </div>
                </section>
            </div>
                <div className="search-area">
                    <Search contentSearch={'items'} onChangeFilter={onChangeFilter}/>
                </div>

            {/* <button className="view-nav-btn"><FaRegUserCircle /> Person  </button> */}
                <div>
                    <button onClick={() => setFilter(!isFilter)} className="view-nav-btn"><BiFilterAlt /> <p>Filter</p></button>
                    {isFilter &&
                        <FilterBoardByType />
                    }
                </div>
            {/* <button className="view-nav-btn"><CgArrowsScrollV /> Sort  </button>
            <button className="view-nav-btn"><AiOutlineEyeInvisible /> Hide  </button>
            <button className="view-nav-btn"><HiOutlineDotsHorizontal />  </button> */}
        </div>
    )
}