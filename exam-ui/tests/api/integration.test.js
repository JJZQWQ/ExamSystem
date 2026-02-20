import { authService } from '../../src/api/auth/auth';
import { examService } from '../../src/api/exam/exam';
import { userService } from '../../src/api/user/user';

/**
 * API集成测试
 * 验证各API服务是否能正常工作
 */
class ApiIntegrationTest {
  constructor() {
    this.results = [];
    this.successCount = 0;
    this.failCount = 0;
  }

  log(message) {
    console.log(`[测试] ${message}`);
  }

  error(message, error) {
    console.error(`[错误] ${message}:`, error);
  }

  async runTest(testName, testFn) {
    this.log(`开始测试: ${testName}`);
    try {
      const result = await testFn();
      this.successCount++;
      this.results.push({
        name: testName,
        status: 'success',
        result
      });
      this.log(`✓ 测试通过: ${testName}`);
    } catch (error) {
      this.failCount++;
      this.results.push({
        name: testName,
        status: 'failed',
        error: error.message || String(error)
      });
      this.error(`✗ 测试失败: ${testName}`, error);
    }
  }

  printSummary() {
    console.log('\n=== 测试摘要 ===');
    console.log(`总测试数: ${this.results.length}`);
    console.log(`通过: ${this.successCount}`);
    console.log(`失败: ${this.failCount}`);
    
    if (this.failCount > 0) {
      console.log('\n失败详情:');
      this.results.filter(r => r.status === 'failed').forEach(r => {
        console.log(`- ${r.name}: ${r.error}`);
      });
    }
    
    console.log('\n=== 测试结束 ===');
  }

  async runAllTests() {
    this.log('开始执行API集成测试');
    
    // 测试基础API连接
    await this.runTest('基础API连接测试', async () => {
      // 尝试一个简单的GET请求来验证连接
      // 注意：根据后端实际情况调整路径
      const response = await fetch('/api/health', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error(`API连接失败，状态码: ${response.status}`);
      }
      
      const data = await response.json();
      this.log(`健康检查响应: ${JSON.stringify(data)}`);
      return data;
    });

    // 测试认证相关API
    await this.runTest('认证服务可用性测试', async () => {
      // 测试获取当前用户信息（可能返回未登录状态，但不应该抛出异常）
      const result = await authService.getCurrentUser().catch(error => {
        if (error.response && error.response.status === 401) {
          this.log('未登录状态，这是预期行为');
          return { notLoggedIn: true };
        }
        throw error;
      });
      return result;
    });

    // 测试考试服务
    await this.runTest('考试服务可用性测试', async () => {
      // 尝试获取考试列表（可能需要权限，但不应该抛出网络异常）
      const result = await examService.getExams().catch(error => {
        if (error.response && error.response.status === 401) {
          this.log('未授权访问考试列表，这是预期行为');
          return { unauthorized: true };
        }
        throw error;
      });
      return result;
    });

    // 测试用户服务
    await this.runTest('用户服务可用性测试', async () => {
      // 尝试获取用户列表（可能需要权限，但不应该抛出网络异常）
      const result = await userService.getUsers().catch(error => {
        if (error.response && error.response.status === 401) {
          this.log('未授权访问用户列表，这是预期行为');
          return { unauthorized: true };
        }
        throw error;
      });
      return result;
    });

    this.printSummary();
  }
}

// 运行测试
if (typeof require !== 'undefined' && require.main === module) {
  const test = new ApiIntegrationTest();
  test.runAllTests().catch(err => {
    console.error('测试执行失败:', err);
  });
}

export default ApiIntegrationTest;