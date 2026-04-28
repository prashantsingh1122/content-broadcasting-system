require('dotenv').config();
const AWS = require('aws-sdk');

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

const testS3 = async () => {
  try {
    console.log('🧪 Testing AWS S3 connection...\n');
    
    // Check credentials
    if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
      console.log('❌ AWS credentials missing in .env file!');
      return;
    }
    
    if (!process.env.AWS_BUCKET_NAME) {
      console.log('❌ AWS_BUCKET_NAME missing in .env file!');
      return;
    }
    
    console.log('Bucket:', process.env.AWS_BUCKET_NAME);
    console.log('Region:', process.env.AWS_REGION);
    
    // List buckets
    console.log('\nListing S3 buckets...');
    const buckets = await s3.listBuckets().promise();
    console.log('✅ S3 connection successful!');
    console.log('Available buckets:', buckets.Buckets.map(b => b.Name).join(', '));
    
    // Check if our bucket exists
    const bucketExists = buckets.Buckets.some(b => b.Name === process.env.AWS_BUCKET_NAME);
    if (!bucketExists) {
      console.log(`\n⚠️  Bucket "${process.env.AWS_BUCKET_NAME}" not found!`);
      console.log('Please create this bucket in AWS S3 console');
      return;
    }
    
    console.log(`✅ Bucket "${process.env.AWS_BUCKET_NAME}" exists!`);
    
    // Test upload (WITHOUT ACL)
    console.log('\nTesting file upload...');
    const testParams = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: 'test/hello.txt',
      Body: 'Hello from Content Broadcasting System!',
      ContentType: 'text/plain'
      // ACL removed - using bucket policy instead
    };
    
    const uploadResult = await s3.upload(testParams).promise();
    console.log('✅ Test file uploaded successfully!');
    console.log('Key:', uploadResult.Key);
    console.log('URL:', `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${uploadResult.Key}`);
    
    // Clean up test file
    await s3.deleteObject({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: 'test/hello.txt'
    }).promise();
    console.log('✅ Test file cleaned up');
    
    console.log('\n🎉 AWS S3 is configured and working!');
    console.log('\n⚠️  Note: You need to set bucket policy for public access.');
    console.log('See instructions below.\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ S3 Test failed!');
    console.error('Error:', error.message);
    
    if (error.code === 'InvalidAccessKeyId') {
      console.log('\n💡 Solution: Check your AWS_ACCESS_KEY_ID in .env');
    } else if (error.code === 'SignatureDoesNotMatch') {
      console.log('\n💡 Solution: Check your AWS_SECRET_ACCESS_KEY in .env');
    } else if (error.code === 'NoSuchBucket') {
      console.log('\n💡 Solution: Create the bucket in AWS S3 console');
    }
    
    process.exit(1);
  }
};

testS3();