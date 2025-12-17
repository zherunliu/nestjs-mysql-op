<template>
  <div style="display: flex">
    <el-input
      v-model="search.keyWord"
      placeholder="Search by name"
      style="width: 300px; margin-right: 10px; margin-bottom: 20px"
      :prefix-icon="Search"
    />
    <el-button type="primary" @click="getList"> Search </el-button>
    <el-button @click="addRow"> Add User </el-button>
  </div>

  <el-table :data="tableData" table-layout="auto">
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
    <el-table-column
      align="center"
      label="CreatedDate"
      prop="createdAt"
      :formatter="formatDate"
    />
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
  <el-dialog
    style="padding-right: 50px"
    v-model="dialogFormVisible"
    title="Add User"
    width="500"
  >
    <el-form ref="rule-form-ref" :rules="rules" :model="form">
      <el-form-item label="Name" prop="name" :label-width="formLabelWidth">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="Age" prop="age" :label-width="formLabelWidth">
        <el-input v-model.number="form.age" />
      </el-form-item>
      <el-form-item label="Gender" prop="gender" :label-width="formLabelWidth">
        <el-select v-model="form.gender" placeholder="Please select a gender">
          <el-option label="Female" value="female" />
          <el-option label="Male" value="male" />
        </el-select>
      </el-form-item>
      <el-form-item
        v-if="form.id === undefined"
        label="Password"
        prop="password"
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
        <el-button type="primary" @click="save(ruleFormRef)">
          Confirm
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { Male, Female, Search } from "@element-plus/icons-vue";
import {
  getUserList,
  addUser,
  updateUser,
  deleteUser,
  type IUserDto,
} from "./server";
import { ref, reactive, onMounted, useTemplateRef } from "vue";
import dayjs from "dayjs";
import { type FormInstance, type FormRules } from "element-plus";

const formLabelWidth = "120px";
const dialogFormVisible = ref(false);
const search = reactive({
  keyWord: "",
});
const defaultForm: IUserDto = {
  id: undefined,
  name: "",
  age: null,
  gender: "",
  password: "",
  techs: [],
  profile: {
    nickname: "",
    bio: "",
  },
};
const tableData = ref([]);
const form = reactive<IUserDto>({ ...defaultForm });

const ruleFormRef = useTemplateRef<FormInstance>("rule-form-ref");
const rules = reactive<FormRules<IUserDto>>({
  name: [{ required: true, message: "Please input name", trigger: "blur" }],
  age: [
    {
      type: "number",
      required: true,
      message: "Please input age",
      trigger: "blur",
    },
  ],
  gender: [
    {
      required: true,
      message: "Please select a gender",
      trigger: "blur",
    },
  ],
  password: [
    { required: true, message: "Please input password", trigger: "blur" },
  ],
});

const addRow = () => {
  dialogFormVisible.value = true;
  // 不能深拷贝
  // Object.assign(form, defaultForm);
  Object.assign(form, JSON.parse(JSON.stringify(defaultForm)));
};

const getList = async () => {
  const list = await getUserList(search);
  tableData.value = list;
};

const save = async (validate: FormInstance | null) => {
  try {
    await validate?.validate();
    if (form.id) await updateUser(form);
    else await addUser(form);
    ElMessage({ message: "Saved successfully", type: "success" });
    dialogFormVisible.value = false;
    getList();
  } catch (error) {
    ElMessage({ message: "Please check the form fields.", type: "error" });
    console.log("Form validation failed:", error);
    return;
  }
};

const editRow = async (row: IUserDto) => {
  dialogFormVisible.value = true;
  Object.assign(form, row);
};

const deleteRow = async (row: IUserDto) => {
  await deleteUser(row);
  getList();
};

const formatDate = (row: IUserDto) => {
  if (!row.createdAt) return "-";
  return dayjs(row.createdAt).format("YYYY-MM-DD HH:mm:ss");
};

onMounted(getList);
</script>
