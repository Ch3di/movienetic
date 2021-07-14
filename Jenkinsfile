pipeline {
  
  agent any
  
  environment {
      MV_JWT_PRIVATE_KEY = credentials('movienetec-secret-key')
      MV_DB_URI = credentials('movienetec-db-uri')
      MV_DB_TEST_URI = credentials('movienetec-db-test-uri')
      DOCKER_HUB_REPO = "ch3di/movienetec"
  }

  tools {
    nodejs "nodejs-14.15.0"
  }
  
  stages {
    stage('Test') {
      when {
        expression {
          env.BRANCH_NAME == 'dev'
        }
      }
      steps {
        echo 'Installing dependencies and running tests...'
        sh '''
          export mv_jwtPrivateKey=${MV_JWT_PRIVATE_KEY}
          export mv_db=${MV_DB_TEST_URI}
          npm install --also=dev
          npm run test
        '''
      }
    }

    stage('Build Docker Image') {
      when {
        expression {
          env.BRANCH_NAME == 'master'
        }
      }
      steps {
        echo 'Building Docker image...'
        sh "docker build -t movienetec:${env.BUILD_ID} ."
      }
    }

    stage('Run The Built Docker Image') {
      when {
        expression {
          env.BRANCH_NAME == 'master'
        }
      }
      steps {
          echo 'Running Docker container...'
          sh "docker run -d -p 3000:3000 -e mv_jwtPrivateKey=$MV_JWT_PRIVATE_KEY -e mv_db=$MV_DB_URI movienetec:${env.BUILD_ID}"
      }
    }

    stage('Push The Docker Image in DockerHub') {
      when {
        expression {
          env.BRANCH_NAME == 'master'
        }
      }
      steps {
        echO 'login to DockerHub and push the image'
        sh "docker tag movienetec:${env.BUILD_ID} $DOCKER_HUB_REPO:${env.BUILD_ID}"
        withCredentials([usernamePassword(credentialsId: 'docker-hub', usernameVariable: 'USER', passwordVariable: 'PASSWORD')]) {
          sh "echo $PASSWORD | docker login -u $USER --password-stdin"
          sh "docker push $DOCKER_HUB_REPO:${env.BUILD_ID}"
        }
      }
    }

    stage('Deploy') {
      steps {
        echo 'deploying..'
      }
    }
  }
}
