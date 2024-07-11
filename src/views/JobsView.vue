<template>
    <div>
        <el-button type="primary" @click="showAddDialog = true">添加任务</el-button>
        <el-table :data="jobs" style="width: 100%">
            <el-table-column prop="name" label="任务名称" width="200"></el-table-column>
            <el-table-column prop="args" label="参数">
                <template slot-scope="scope">
                    <span v-if="scope.row.args && scope.row.args.length > 0">
                        <el-tag v-for="(arg, index) in scope.row.args" :key="index" style="margin-right: 3px;">
                            {{ arg }}
                        </el-tag>
                    </span>
                    <span v-else><el-tag type="info">无参数</el-tag></span>
                </template>
            </el-table-column>
            <el-table-column prop="hour" label="小时" width="80"></el-table-column>
            <el-table-column prop="minute" label="分钟" width="80"></el-table-column>
            <el-table-column prop="frequency" label="频率" width="100"> <template slot-scope="scope">
                    <span>{{ frequency[scope.row.frequency] }}</span>
                </template></el-table-column>

            <el-table-column prop="day_of_week" label="星期几" width="100">
                <template slot-scope="scope">
                    <span>{{ week[scope.row.day_of_week] }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="day_of_month" label="几号" width="100">
                <template slot-scope="scope">
                    <span>{{ scope.row.day_of_month }}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="200">
                <template slot-scope="scope">
                    <el-button type="danger" size="mini" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    <el-button type="primary" size="mini" @click="openEditDialog(scope.row)">编辑</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog title="添加任务" :visible.sync="showAddDialog">
            <el-form :model="newJob" label-width="120px">
                <el-form-item label="任务名称">
                    <el-select v-model="newJob.name" placeholder="请选择任务" @change="updateArgs">
                        <el-option v-for="func in jobFunctions" :key="func.name" :label="func.name"
                            :value="func.name"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item v-if="newJob.args.length > 0" label="参数">
                    <div v-for="(arg, index) in newJob.args" :key="index" style="margin-bottom: 20px;">
                        <el-input v-model="newJob.args[index]"
                            :placeholder="jobFunctionsMap[newJob.name]?.args[index] || '参数'"></el-input>
                    </div>
                </el-form-item>
                <el-form-item label="日期和时间">
                    <el-date-picker v-model="newJob.datetime" type="datetime" placeholder="选择日期和时间"></el-date-picker>
                </el-form-item>
                <el-form-item label="频率">
                    <el-select v-model="newJob.frequency" placeholder="请选择频率">
                        <el-option label="每天" value="daily"></el-option>
                        <el-option label="每周" value="weekly"></el-option>
                        <el-option label="每月" value="monthly"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="showAddDialog = false">取消</el-button>
                <el-button type="primary" @click="handleAdd">添加</el-button>
            </div>
        </el-dialog>

        <el-dialog title="编辑任务" :visible.sync="showEditDialog">
            <el-form :model="editJob" label-width="120px">
                <el-form-item label="任务名称">
                    <el-input v-model="editJob.name" disabled></el-input>
                </el-form-item>
                <el-form-item v-if="editJob.args.length > 0" label="参数">
                    <div v-for="(arg, index) in editJob.args" :key="index" style="margin-bottom: 20px;">
                        <el-input v-model="editJob.args[index]"
                            :placeholder="jobFunctionsMap[editJob.name]?.args[index] || '参数'"></el-input>
                    </div>
                </el-form-item>
                <el-form-item label="日期和时间">
                    <el-date-picker v-model="editJob.datetime" type="datetime" placeholder="选择日期和时间"></el-date-picker>
                </el-form-item>
                <el-form-item label="频率">
                    <el-select v-model="editJob.frequency" placeholder="请选择频率">
                        <el-option label="每天" value="daily"></el-option>
                        <el-option label="每周" value="weekly"></el-option>
                        <el-option label="每月" value="monthly"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="showEditDialog = false">取消</el-button>
                <el-button type="primary" @click="handleEdit">保存</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { getAllJobs, getJobFunctions, createJob, updateJob, deleteJob } from '@/api';
import { Message } from 'element-ui';

export default {
    data() {
        return {
            frequency: { daily: "每天", weekly: "每周", monthly: "每月" },
            week: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
            jobs: [],
            jobFunctions: [],
            jobFunctionsMap: {},
            showAddDialog: false,
            showEditDialog: false,
            newJob: {
                name: '',
                args: [],
                datetime: '',
                frequency: '',
            },
            editJob: {
                id: null,
                name: '',
                args: [],
                datetime: '',
                frequency: '',
            }
        };
    },
    created() {
        this.fetchJobs();
        this.fetchJobFunctions();
    },
    methods: {
        async fetchJobs() {
            try {
                const response = await getAllJobs();
                this.jobs = response.data;
            } catch (error) {
                console.error('Error fetching jobs:', error);
            }
        },
        async fetchJobFunctions() {
            try {
                const response = await getJobFunctions();
                this.jobFunctions = response.data;
                this.jobFunctions.forEach(func => {
                    this.jobFunctionsMap[func.name] = func;
                });
            } catch (error) {
                console.error('Error fetching job functions:', error);
            }
        },
        async handleAdd() {
            try {
                const datetime = new Date(this.newJob.datetime);
                const hour = datetime.getHours();
                const minute = datetime.getMinutes();
                const day_of_week = datetime.getDay();
                const day_of_month = datetime.getDate();

                await createJob(
                    this.newJob.name,
                    this.newJob.args,
                    hour,
                    minute,
                    this.newJob.frequency,
                    day_of_week,
                    day_of_month
                );
                await this.fetchJobs();
                this.showAddDialog = false;
                this.resetNewJob();
                Message.success('添加成功');
            } catch (error) {
                console.error('Error creating job:', error);
            }
        },
        async handleEdit() {
            try {
                const datetime = new Date(this.editJob.datetime);
                const hour = datetime.getHours();
                const minute = datetime.getMinutes();
                const day_of_week = datetime.getDay();
                const day_of_month = datetime.getDate();

                await updateJob(
                    this.editJob.id,
                    this.editJob.args,
                    hour,
                    minute,
                    this.editJob.frequency,
                    day_of_week,
                    day_of_month
                );
                await this.fetchJobs();
                this.showEditDialog = false;
                Message.success('修改成功');
            } catch (error) {
                console.error('Error updating job:', error);
            }
        },
        async handleDelete(index, row) {
            try {

                await deleteJob(row.id);
                this.jobs.splice(index, 1);
                Message.success('删除成功');
            }
            catch (error) {
                console.error('Error deleting job:', error);
            }

        },
        openEditDialog(row) {
            this.editJob = {
                id: row.id,
                name: row.name,
                args: [...row.args],
                datetime: new Date().setHours(row.hour, row.minute), // Set the datetime from hour and minute
                frequency: row.frequency
            };
            this.showEditDialog = true;
        },
        updateArgs() {
            const selectedFunction = this.jobFunctionsMap[this.newJob.name];
            this.newJob.args = selectedFunction ? Array(selectedFunction.args.length).fill('') : [];
        },
        resetNewJob() {
            this.newJob = {
                name: '',
                args: [],
                datetime: '',
                frequency: '',
            };
        }
    }
};
</script>



<style scoped>
.el-button {
    margin-bottom: 20px;
}
</style>
