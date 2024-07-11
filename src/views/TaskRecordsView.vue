<template>
    <div>
        <el-form :inline="true" :model="form" class="demo-form-inline">
            <el-form-item label="选择群组">
                <el-select v-model="form.selectedGroup" placeholder="请选择群组" @change="handleGroupChange"
                    filterable="true">
                    <el-option v-for="item in groupOptions" :key="item.wxid" :label="item.name" :value="item.wxid">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-switch v-model="form.showAllTasks" active-color="#13ce66" inactive-color="#ff4949"
                    active-text="全部任务" inactive-text="未处理任务" @change="fetchTaskRecords">
                </el-switch>
            </el-form-item>
        </el-form>
        <el-table :data="taskRecords" style="width: 100%" v-loading="loading">
            <el-table-column prop="group.name" label="群组名"></el-table-column>
            <el-table-column prop="personnel.nickname" label="任务人"></el-table-column>
            <el-table-column label="内容" width="300px">
                <template slot-scope="scope">
                    <span v-if="scope.row.message_type === 1">{{ scope.row.content }}</span>
                    <img v-else-if="scope.row.message_type === 3" :src="`${baseURL}${scope.row.attched_file}`"
                        alt="附件图片" style="width: 100px; height: auto; cursor: pointer;"
                        @click="showLargeImage(`${baseURL}${scope.row.attched_file}`)">
                </template>
            </el-table-column>
            <el-table-column prop="created_at" label="创建时间"></el-table-column>

            <el-table-column label="处理情况">
                <template slot-scope="scope">
                    <span v-if="scope.row.is_processed">✔️已处理:{{ formatDateTime(scope.row.processed_at) }}</span>
                    <span v-else>❌未处理</span>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template #default="scope">
                    <el-button v-if="scope.row.is_processed" type="danger"
                        @click="handleCheckTaskRecord(scope.row.id, false)" icon="el-icon-close" circle
                        size="mini"></el-button>
                    <el-button v-else type="success" @click="handleCheckTaskRecord(scope.row.id, true)"
                        icon="el-icon-check" size="mini" circle></el-button>
                    <el-button type="primary" plain size="mini" @click="handleShowProgress(scope.row)">查看进度</el-button>
                    <el-button type="success" plain size="mini" @click="handleAddProgress(scope.row)">添加进度</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination @current-change="handlePageChange" @size-change="handleSizeChange" :current-page="currentPage"
            :page-size="pageSize" layout="total, sizes, prev, pager, next" :total="totalRecords">
        </el-pagination>
        <!-- 大图显示部分 -->
        <el-dialog :visible.sync="showImageDialog" width="50%">
            <img v-if="currentImageUrl" :src="currentImageUrl" alt="大图预览" style="width: 100%; height: auto;">
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="showImageDialog = false">关闭</el-button>
            </span>
        </el-dialog>
        <!-- 进度表 -->
        <template>
            <el-dialog :visible.sync="showProgessDialog" width="50%">
                <div style="height: auto;">
                    <el-steps direction="vertical" :active="activeStep" process-status="finish"
                        finish-status="process ">
                        <el-step v-for="(step, index) in steps" :key="index" :title="step.title"
                            :description="step.description"></el-step>
                    </el-steps>
                </div>
            </el-dialog>
        </template>
        <!-- 添加进度 -->
        <el-dialog :visible.sync="showAddProgessDialog" width="25%">
            <el-form :model="addForm">
                <el-form-item label="记录人" :label-width="formLabelWidth">
                    <el-select v-model="addForm.selectedPersonnel" placeholder="请选择记录人" filterable="true">
                        <el-option v-for="person in personnelOptions" :key="person.wxid"
                            :label="`${person.nickname} ${person.remark}`" :value="person.wxid"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="进度内容" :label-width="formLabelWidth">
                    <el-input v-model="addForm.content" placeholder="输入进度内容"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="showAddProgessDialog = false">取消</el-button>
                <el-button type="primary" @click="addTaskProgess">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { fetchGroupOptions, fetchTaskRecords, baseURL, checkTaskRecord, fetchPersonnelOptions, createTaskProgess, getTaskProgress } from '@/api';
import { formatDateTime } from '@/utils';
import { Message } from 'element-ui';

export default {
    data() {
        return {
            baseURL: baseURL,
            loading: false,
            form: {
                selectedGroup: '',
                showAllTasks: true
            },
            groupOptions: [],
            taskRecords: [],
            currentPage: 1,
            pageSize: 10,
            totalRecords: 0,
            showImageDialog: false,
            showProgessDialog: false,
            showAddProgessDialog: false,
            addForm: {
                selectedPersonnel: '',
                content: '',
                taskRecordId: 0
            },
            personnelOptions: [],
            steps: [],
            activeStep: 0
        };
    },
    created() {
        this.fetchGroupOptions();
    },
    methods: {
        formatDateTime(dateStr) {
            return formatDateTime(dateStr);
        },
        async fetchGroupOptions() {
            try {
                this.groupOptions = (await fetchGroupOptions()).data;
            } catch (error) {
                console.error('Failed to fetch group options:', error);
            }
        },
        async fetchTaskRecords() {
            if (this.form.selectedGroup) {
                try {
                    this.loading = true;
                    const response = await fetchTaskRecords(this.form.selectedGroup, this.form.showAllTasks, this.currentPage, this.pageSize);
                    this.taskRecords = response.data.data;
                    this.totalRecords = response.data.count;
                    this.loading = false;
                } catch (error) {
                    console.error('Failed to fetch task records:', error);
                }
            }
        },
        async handleCheckTaskRecord(taskRecordId, isProcessed) {
            try {
                await checkTaskRecord(taskRecordId, isProcessed);
                this.fetchTaskRecords();
                this.$message.success('提交成功');
            } catch (error) {
                console.error('Failed to check task record:', error);
            }
        },
        async handleShowProgress(taskRecord) {
            try {
                const TaskProgress = (await getTaskProgress(taskRecord.id)).data;
                if (TaskProgress.length == 0) {
                    this.$message.warning('该任务没有进度');
                    return;
                }
                this.steps = [];
                for (let i = 0; i < TaskProgress.length; i++) {
                    this.steps.push({
                        title: `${formatDateTime(taskRecord.created_at)}  ${TaskProgress[i].proccess_personnel.nickname} ${TaskProgress[i].proccess_personnel.remark}`,
                        description: TaskProgress[i].content
                    });
                }
                this.activeStep = TaskProgress.length - 1;
                this.showProgessDialog = true;
            } catch (error) {
                console.error('Failed to get task progress:', error);
            }

        },
        async handleAddProgress(taskRecord) {
            this.addForm.taskRecordId = taskRecord.id;
            this.showAddProgessDialog = true;
        },
        async handleGroupChange(groupWxid) {
            this.currentPage = 1;
            this.fetchTaskRecords();
            this.loadPersonnelOptions(groupWxid);
        },
        async loadPersonnelOptions(groupWxid) {
            try {
                const response = await fetchPersonnelOptions(groupWxid);
                this.personnelOptions = response.data;
            } catch (error) {
                console.error('Failed to load personnel options:', error);
            }
        },
        handlePageChange(page) {
            this.currentPage = page;
            this.fetchTaskRecords();
        },
        handleSizeChange(size) {
            this.pageSize = size;
            this.currentPage = 1;
            this.fetchTaskRecords();
        },
        showLargeImage(imageUrl) {
            this.currentImageUrl = imageUrl;
            this.showImageDialog = true;
        },
        async addTaskProgess() {
            try {
                await createTaskProgess(this.addForm.taskRecordId, this.addForm.selectedPersonnel, this.addForm.content)
                Message.success('添加成功');
                this.showAddProgessDialog = false;
            } catch (error) {
                console.error('Failed to add task progress:', error);
            }

        },
    },
};
</script>

<style></style>
