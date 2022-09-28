import { NavLink } from "react-router-dom"
import BoardNavIcon from '../../assets/svgs/BoardNavIcon.svg'
import { HiDotsHorizontal } from 'react-icons/hi'
import { HiOutlineDocumentDuplicate } from 'react-icons/hi'
import { RiPencilLine } from 'react-icons/ri'
import { HiOutlineArchive } from 'react-icons/hi'
import { MdDeleteOutline } from 'react-icons/md'


export function BoardList({ filteredBoards, onRemoveBoard, isDropDownOpen, toggleDropdown, onDuplicateBoard}) {

    return <section>
        {filteredBoards.map(board => {
            return <div className="boards-list flex space-between" key={board._id}>
                <NavLink className="flex inline-flex option" to={`/board/${board._id}`}>
                    {/* <HiOutlineClipboard className="table-chart flex column align-center" /> */}
                    <img className="table-chart flex column align-center" src={BoardNavIcon} alt="" />
                    <span className="menu-btn-inner-text">{board.title}</span>
                    <i className="dropdown-dot">
                        <div className="dropdown" onClick={(ev) => {
                            ev.preventDefault()
                            toggleDropdown()
                        }} ><HiDotsHorizontal className="points" />
                            {isDropDownOpen && <div className="dropdown-content ">
                                <i onClick={() => onDuplicateBoard(board)}><HiOutlineDocumentDuplicate className="icon-dropdown" /> Duplicate Board</i>
                                <i><RiPencilLine className="icon-dropdown" /> Rename</i><hr />
                                <i><HiOutlineArchive className="icon-dropdown" /> Archive</i>
                                <i onClick={(ev) => {
                                    ev.preventDefault()
                                    ev.stopPropagation()
                                    onRemoveBoard(board._id)
                                }}><MdDeleteOutline className="icon-dropdown" /> Delete</i>
                            </div>}
                        </div>
                    </i>
                </NavLink>
            </div>
        }
        
        )}

</section>
}