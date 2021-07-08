pipeline {
  agent any

  stages {
    stage('Build') {
      steps {
        echo 'Building..'
        nodejs('nodejs-14.15.0') {
          sh 'npm install --dev'
        }
      }
    }
    stage('Test') {
      steps {
        echo 'Testing...'
        
      }
    }
    stage('Deploy') {
      steps {
        echo 'deploying..'
      }
    }
    stage('Run') {
      steps {
        echo 'deploying..'
        nodejs('nodejs-14.15.0') {
          sh 'npm start'
        }
      }
    }
  }
}