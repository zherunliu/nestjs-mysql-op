<template>
  <div style="display: flex">
    <el-input
      v-model="search.keyWord"
      placeholder="Search by name"
      style="width: 300px; margin-right: 10px; margin-bottom: 20px"
      :prefix-icon="Search"
    />
    <el-button type="primary" @click="getList"> Search </el-button>
    <el-button @click="openDialog"> Add User </el-button>
  </div>

  <el-table :data="tableData">
    <el-table-column type="expand">
      <template #default="props">
        <div>
          <p>Nickname: {{ props.row.profile?.nickname || "-" }}</p>
          <p>Bio: {{ props.row.profile?.bio || "-" }}</p>
          <div>
            <span>Techs:</span>
            <span v-for="tech of props.row.techs" :key="tech">
              <el-tag style="margin-left: 10px" type="success">{{
                tech
              }}</el-tag>
            </span>
          </div>
        </div>
      </template>
    </el-table-column>
    <el-table-column align="center" label="Id" prop="id" />
    <el-table-column align="center" label="Name" prop="name" />
    <el-table-column align="center" label="Gender">
      <template #default="scope">
        <el-icon v-if="scope.row.gender === 'female'" :size="20" color="#f77777"
          ><Female
        /></el-icon>
        <el-icon v-else :size="20" color="#409efc"><Male /></el-icon>
      </template>
    </el-table-column>
    <el-table-column align="center" label="Age" prop="age" />
    <el-table-column align="center" label="CreatedDate" prop="createdAt" />
    <el-table-column align="center" label="Uid" prop="uid" />
    <el-table-column align="center" label="Actions">
      <template #default="scope">
        <el-button type="primary" size="small" @click="editRow(scope.row)"
          >Edit</el-button
        >
        <el-button type="danger" size="small" @click="deleteRow(scope.row)"
          >Delete</el-button
        >
      </template>
    </el-table-column>
  </el-table>
  <el-dialog v-model="dialogFormVisible" title="Add User" width="500">
    <el-form :model="form">
      <el-form-item label="Name" :label-width="formLabelWidth">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="Age" :label-width="formLabelWidth">
        <el-input v-model="form.age" />
      </el-form-item>
      <el-form-item label="Gender" :label-width="formLabelWidth">
        <el-select v-model="form.gender" placeholder="Please select a gender">
          <el-option label="Female" value="female" />
          <el-option label="Male" value="male" />
        </el-select>
      </el-form-item>
      <el-form-item
        v-if="form.id === null"
        label="Password"
        :label-width="formLabelWidth"
      >
        <el-input type="password" v-model="form.password" />
      </el-form-item>
      <el-form-item label="Nickname" :label-width="formLabelWidth">
        <el-input v-model="form.profile.nickname" />
      </el-form-item>
      <el-form-item label="Bio" :label-width="formLabelWidth">
        <el-input v-model="form.profile.bio" />
      </el-form-item>
      <el-form-item label="Techs" :label-width="formLabelWidth">
        <el-input-tag
          v-model="form.techs"
          trigger="Space"
          placeholder="Please use space splitting"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogFormVisible = false">Cancel</el-button>
        <el-button type="primary" @click="save"> Confirm </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { Male, Female, Search } from "@element-plus/icons-vue";
import { getUserList, addUser, updateUser, deleteUser } from "./server";
import { ref, reactive, onMounted } from "vue";

const formLabelWidth = "120px";
const dialogFormVisible = ref(false);
const search = reactive({
  keyWord: "",
});
const form = reactive({
  id: null,
  name: "",
  age: null,
  gender: "",
  password: "",
  techs: [],
  profile: {
    nickname: "",
    bio: "",
  },
});
const tableData = ref([]);
const resetFrom = reactive({ ...form });

const openDialog = () => {
  dialogFormVisible.value = true;
  Object.assign(form, resetFrom);
};

const getList = async () => {
  const list = await getUserList(search);
  tableData.value = list;
};

const save = async () => {
  if (form.id) await updateUser(form);
  else await addUser(form);
  dialogFormVisible.value = false;
  getList();
};

const editRow = async (row) => {
  dialogFormVisible.value = true;
  Object.assign(form, row);
  save();
};

const deleteRow = async (row) => {
  await deleteUser(row);
  getList();
};

onMounted(getList);
</script>
