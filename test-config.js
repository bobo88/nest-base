// 测试脚本：验证生产环境配置加载
const { execSync } = require('child_process');

console.log('🔍 测试生产环境配置加载...\n');

// 测试1：检查NODE_ENV设置
console.log('1. 检查NODE_ENV环境变量:');
try {
  const result = execSync('cross-env NODE_ENV=production node -e "console.log(process.env.NODE_ENV)"', { encoding: 'utf8' });
  console.log(`   ✅ NODE_ENV = ${result.trim()}`);
} catch (error) {
  console.log('   ❌ 无法设置NODE_ENV');
}

// 测试2：检查生产环境配置文件是否存在
console.log('\n2. 检查生产环境配置文件:');
const fs = require('fs');
if (fs.existsSync('.env.production')) {
  console.log('   ✅ .env.production 文件存在');
  
  // 读取生产环境配置
  const prodConfig = fs.readFileSync('.env.production', 'utf8');
  const dbUrlMatch = prodConfig.match(/DATABASE_URL=(.+)/);
  if (dbUrlMatch) {
    console.log(`   ✅ 生产环境数据库: ${dbUrlMatch[1]}`);
  }
} else {
  console.log('   ❌ .env.production 文件不存在');
}

// 测试3：模拟生产环境启动
console.log('\n3. 模拟生产环境启动配置:');
try {
  const result = execSync('cross-env NODE_ENV=production node -e "
    const { ConfigModule } = require(\'@nestjs/config\');
    const config = ConfigModule.forRoot({
      envFilePath: [
        \`.env.${process.env.NODE_ENV || \'development\'}.local\`,
        \`.env.${process.env.NODE_ENV || \'development\'}\`,
        \'.env.local\',
        \'.env\',
      ]
    });
    console.log(\'配置模块加载成功\');
  "', { encoding: 'utf8' });
  console.log('   ✅ 配置模块可以正常加载');
} catch (error) {
  console.log('   ❌ 配置模块加载失败:', error.message);
}

console.log('\n📋 配置加载顺序:');
console.log('   1. .env.production.local (生产环境本地覆盖)');
console.log('   2. .env.production (生产环境配置)');
console.log('   3. .env.local (全局本地覆盖)');
console.log('   4. .env (默认配置)');

console.log('\n🚀 启动生产环境命令:');
console.log('   npm run start:prod');
console.log('   或手动设置: NODE_ENV=production node dist/main');