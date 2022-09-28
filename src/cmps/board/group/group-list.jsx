import { GroupPreview } from "./group-preview.jsx"
import { GrAdd } from 'react-icons/gr'
import { useEffect } from "react"
import { useSelector } from "react-redux"
import { useState } from "react"
import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import { useDispatch } from "react-redux"
import { updateBoard } from "../../../store/actions/board.action.js"

export const GroupList = ({ board, groups, onAddGroup, onChangeFilter }) => {
    const filterBy = useSelector(state => state.boardModule.filterBy)
    const [filteredGroups, setFilteredGroups] = useState(groups)
    const [sort, setSort] = useState({ sortBy: '', isDescending: 1 })
    const dispatch = useDispatch()

    useEffect(() => {
        filterGroupsAndTasks()
    }, [groups, filterBy, sort])

    const filterGroupsAndTasks = () => {
        //filter
        const { txt } = filterBy
        const regex = new RegExp(txt, 'i')
        const filteredTasksGroups = groups.map(group => {
            return { ...group, tasks: group.tasks.filter((task) => regex.test(task.title)) }
        })
        const filtered = filteredTasksGroups.filter(group => group.tasks.length || regex.test(group.title))

        //sort
        filtered.forEach(group => {
            if (sort.sortBy === 'itemTitle') {
                group.tasks.sort((task1, task2) => task1.title.localeCompare(task2.title) * sort.isDescending)
            } else if (sort.sortBy === 'personName') {
                group.tasks.sort((task1, task2) => {
                    if (task1.persons.length && task2.persons.length)
                        return task1.persons[0].fullname.localeCompare(task2.persons[0].fullname) * sort.isDescending
                })
            } else if (sort.sortBy === 'lastUpdated') {
                group.tasks.sort((task1, task2) => (task1.lastUpdated - task2.lastUpdated) * sort.isDescending)
            } else if (sort.sortBy === 'deadline') {
                group.tasks.sort((a, b) => (b.deadline - a.deadline) * sort.isDescending)
            } else if (sort.sortBy === 'status') {
                group.tasks.sort((a, b) => b.status.localeCompare(a.status) * sort.isDescending)
            } else if (sort.sortBy === 'priority') {
                group.tasks.sort((a, b) => b.priority.localeCompare(a.priority) * sort.isDescending)
            }
        })
        setFilteredGroups(filtered)
    }

    const onSort = (sortBy) => {
        const isDescending = sort.isDescending
        if (sortBy === sort.sortBy) {
            setSort({ ...sort, isDescending: -isDescending })
        }
        else setSort({ ...sort, sortBy, isDescending: 1 })
    }

    // const onHandleGroupDragEnd = (result) => {
    //     console.log(result)
    //     if (!result.destination) return
    //     const { source, destination } = result
    //     if (source.index === destination.index &&
    //         source.droppableId === destination.droppableId
    //     ) return
    //     if (source.droppableId !== destination.droppableId) {
    //         const [removedGroup] = groups.splice(source.index, 1)
    //         groups.splice(destination.index - 1, 0, removedGroup)
    //         setFilteredGroups(groups)
    //     }
    // }

    const onHandleDragEnd = (result) => {
        console.log(result)
        if (!result.destination) return
        const { source, destination, draggableId } = result
        if (source.index === destination.index &&
            source.droppableId === destination.droppableId
        ) return
        if (source.droppableId !== destination.droppableId) {
            const sourceColumn = groups[+source.droppableId]
            const destColumn = groups[+destination.droppableId]
            const sourceItems = [...sourceColumn.tasks]
            const destTasks = [...destColumn.tasks]
            const [removedTask] = sourceItems.splice(source.index, 1)
            destTasks.splice(destination.index, 0, removedTask)
            groups[+source.droppableId] = {
                ...groups[+source.droppableId],
                tasks: sourceItems,
            }
            groups[+destination.droppableId] = {
                ...groups[+destination.droppableId],
                tasks: destTasks,
            }
            setFilteredGroups(groups)
            onUpdateGroups(groups)
        } else {
            const column = groups[+source.droppableId]
            const copiedItems = [...column.tasks]
            const [removedTask] = copiedItems.splice(source.index, 1)
            copiedItems.splice(destination.index, 0, removedTask)
            groups[+source.droppableId] = {
                ...groups[+source.droppableId],
                tasks: copiedItems,
            }
            setFilteredGroups(groups)
            onUpdateGroups(groups)
        }
    }

    const onUpdateGroups = (groups) => {
        const newBoard = { ...board }
        newBoard.groups = [...groups]
        dispatch(updateBoard(newBoard))
    }

    console.log(filteredGroups)
    return (
        <DragDropContext onDragEnd={onHandleDragEnd}>
            <section className="group-list">
                {filteredGroups.map((group, idx) => {
                    return (
                        <section>
                            <Droppable droppableId={`${idx}`} key={group.id} >
                                {(provided) => {
                                    return (
                                        <section ref={provided.innerRef} {...provided.droppableProps} key={group.id}>
                                            <GroupPreview
                                                provided={provided}
                                                key={group.id}
                                                group={group}
                                                onChangeFilter={onChangeFilter}
                                                onHandleTaskDragEnd={onHandleDragEnd}
                                                sortGroup={onSort} />
                                        </section>
                                    )
                                }}
                            </Droppable>
                        </section>
                    )
                }
                )}
                <button className="btn-add-group sticky-feature" onClick={() => onAddGroup('last')}>
                    <span className="add-icon"><GrAdd /></span> Add New Group
                </button>
            </section >
        </DragDropContext >
    )
}
