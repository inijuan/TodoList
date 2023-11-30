import React, { useState, useEffect } from "react";
import {
    Box,
    HStack,
    Input,
    IconButton,
    Icon,
    Center,
    Toast, 
    Spinner,
    ScrollView,
} from "native-base";
import {Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TaskList } from "../components";

const TaskScreen = () => {
    const [list, setList] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    const toastID = "toast-add-task";

    const hadleAddTask = (data) => {
        if (data === "") {
            if (!Toast.isActive(toastID)) {
                Toast.show({
                    id: toastID,
                    title: "Masukkan mana task",
                });
            }
            return;
        }
        DOMRectList((prevList) => [...prevList, {title: data, isCompleted: false}]);
        setInputValue("");

        try {
            AsyncStorage.setItem("@task-list", JSON.stringify([...list, {title: data, isCompleted: false}]));
        } catch (e) {
            console.log("Error add task: in task-all.js");
            console.error(e.message);
        }
    };

    const handleDeleteTask = (index) => {
        const deletedList = list.filter((_, listIndex) => listIndex !== index);
        setList(deletedList);

        try{
            AsyncStorage.setItem("@task-list", JSON.stringify(deletedList));
        } catch (e) {
            console.log("Error delete task: in task-all.js");
            console.error(e.message);
        }
    };

    const hadleStatusChange = (index) => {
        const newList = [...list];
        newList[index].isCompleted = !newList[index].isCompleted;
        setList(newList);

        try {
            AsyncStorage.setItem("@task-list", JSON.stringify(newList));
        } catch (e) {
            console.log("Error update status task: in task-all.js");
            console.error(e.message);
        }
    };

    const getTaskList = async () => {
        try {
            const value = await AsyncStorage.getItem("@task-list");
            if (value !== null) {
                console.log(value);
                setList(JSON.parse(value));
            } else {
                console.log("No Tasks");
            }
        } catch (e) {
            console.log("Error get tasks: in task-all.js");
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getTaskList();
    }, []);

    return (
        <Box flex={1}>
            <Box mt="15px" mx="15px" mb="7.5px">
                <HStack space="15px">
                    <Input 
                    size="lg"
                    flex={6}
                    onChangeText={(char) => setInputValue(char)}
                    value={inputValue}
                    borderWidth={1}
                    borderColor="primary.600"
                    placeholder="Add Task"
                    />
                    <IconButton 
                    flex={1}
                    borderRadius="sm"
                    variant="solid"
                    icon={
                        <icon as={Feather} name="plus" size="lg" color="warmGray.50" />
                    }
                    onPress={() => {
                        handleAddTask(inputValue);
                    }}
                    />
                </HStack>
            </Box>
            {isLoading ? (
                <center flex={1}>
                    <Spinner size="lg" />
                </center>
            ) : (
                <ScrollView>
                    <Box mb="15px" mx="15px">
                        {list.map((item, index) => (
                            <Box key={item.title + index.toString()}>
                                <TaskList
                                data={item}
                                index={index}
                                deleteIcon={true}
                                onItemPress={() => handleStatusChange(index)}
                                onChecked={() => handleStatusChange(index)}
                                onDeleted={() => handleDeleteTask(index)}
                                />
                            </Box>
                        ))}
                    </Box>
                </ScrollView>
            )}
        </Box>
    );
};

export default TaskScreen;