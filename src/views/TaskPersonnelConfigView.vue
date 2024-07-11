<template>
    <div>
        <el-input v-model="searchQuery" placeholder="搜索..."
            style="margin-bottom: 20px; margin-right: 10px;width: 300px;" clearable @clear="handleSearch"
            @input="handleSearch" />
        <el-button @click="showAddDialog = true" type="primary" style="margin-bottom: 20px;">添加</el-button>
        <el-table :data="paginatedData" style="width: 100%" v-loading="loading">
            <el-table-column prop="group.name" label="群组名"></el-table-column>
            <el-table-column prop="group.wxid" label="群组ID"></el-table-column>
            <el-table-column prop="personnel.nickname" label="任务人微信名"></el-table-column>
            <el-table-column prop="personnel.wechat_id" label="任务人微信号"></el-table-column>
            <el-table-column prop="personnel.wxid" label="任务人ID"></el-table-column>
            <el-table-column prop="personnel.remark" label="任务人备注"></el-table-column>
            <el-table-column label="操作" width="150">
                <template #default="scope">
                    <el-button @click="deleteTaskPersonnel(scope.row)" type="danger" size="small">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination style="margin-top: 20px; text-align: right;" :current-page="currentPage" :page-size="pageSize"
            layout="total, prev, pager, next" :total="filteredData.length" @current-change="handlePageChange" />
        <el-dialog :visible.sync="showAddDialog" title="添加任务人员" width="25%">
            <el-form :model="addForm">
                <el-form-item label="选择群聊" :label-width="formLabelWidth">
                    <el-select v-model="addForm.selectedGroup" placeholder="请选择群聊" filterable="true"
                        @change="loadPersonnelOptions">
                        <el-option v-for="group in groupOptions" :key="group.wxid" :label="group.name"
                            :value="group.wxid"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="选择人员" :label-width="formLabelWidth">
                    <el-select v-model="addForm.selectedPersonnel" placeholder="请选择人员" filterable="true">
                        <el-option v-for="person in personnelOptions" :key="person.wxid"
                            :label="`${person.nickname} ${person.remark}`" :value="person.wxid"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="showAddDialog = false">取消</el-button>
                <el-button type="primary" @click="addTaskPersonnel">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { fetchTaskPersonnelConfig, deleteTaskPersonnelConfig, fetchGroupOptions, fetchPersonnelOptions, addTaskPersonnelConfig } from '@/api';
import { Message } from 'element-ui';

export default {
    name: 'TaskPersonnelTable',
    data() {
        return {
            loading: true,
            taskPersonnelData: [],
            showAddDialog: false,
            addForm: {
                selectedGroup: '',
                selectedPersonnel: '',
            },
            groupOptions: [],
            personnelOptions: [],
            formLabelWidth: '120px',
            searchQuery: '',
            currentPage: 1,
            pageSize: 10,
        };
    },
    computed: {
        filteredData() {
            if (this.searchQuery) {
                return this.taskPersonnelData.filter(item =>
                    item.group.name.includes(this.searchQuery) ||
                    item.group.wxid.includes(this.searchQuery) ||
                    item.personnel.nickname.includes(this.searchQuery) ||
                    item.personnel.wechat_id.includes(this.searchQuery) ||
                    item.personnel.wxid.includes(this.searchQuery) ||
                    item.personnel.remark.includes(this.searchQuery)
                );
            }
            return this.taskPersonnelData;
        },
        paginatedData() {
            const start = (this.currentPage - 1) * this.pageSize;
            const end = this.currentPage * this.pageSize;
            return this.filteredData.slice(start, end);
        }
    },
    created() {
        this.loadTaskPersonnelData();
        this.loadGroupOptions();
    },
    methods: {
        async loadTaskPersonnelData() {
            try {
                this.loading = true;
                const response = await fetchTaskPersonnelConfig();
                this.taskPersonnelData = response.data;
                this.loading = false;
            } catch (error) {
                console.error('Failed to load task personnel data:', error);
            }
        },
        async deleteTaskPersonnel(row) {
            try {
                await deleteTaskPersonnelConfig(row.group.wxid, row.personnel.wxid);
                await this.loadTaskPersonnelData();
                Message.success('删除成功');
            } catch (error) {
                console.error('Failed to delete task personnel:', error);
            }
        },
        async loadGroupOptions() {
            try {
                const response = await fetchGroupOptions();
                this.groupOptions = response.data;
            } catch (error) {
                console.error('Failed to load group options:', error);
            }
        },
        async loadPersonnelOptions(groupWxid) {
            try {
                const response = await fetchPersonnelOptions(groupWxid);
                this.personnelOptions = response.data;
            } catch (error) {
                console.error('Failed to load personnel options:', error);
            }
        },
        async addTaskPersonnel() {
            try {
                await addTaskPersonnelConfig(this.addForm.selectedGroup, this.addForm.selectedPersonnel)
                await this.loadTaskPersonnelData();
                this.showAddDialog = false;
                Message.success('添加成功');
            } catch (error) {
                console.error('Failed to add task personnel:', error);
            }
        },
        handleSearch() {
            this.currentPage = 1;
        },
        handlePageChange(page) {
            this.currentPage = page;
        }
    },
};
</script>

<style scoped></style>
