pipeline {
  
  agent any
  
  environment {
      MV_JWT_PRIVATE_KEY = credentials('movienetec-secret-key')
      MV_DB_URI = credentials('movienetec-db-uri')
      MV_DB_TEST_URI = credentials('movienetec-db-test-uri')
      DOCKER_HUB_REPO = "ch3di/movienetec"
      NEW_VERSION = ""
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

    stage('Increment Version') {
      steps {
        echo 'Incrementing the version of the project...'
        sh "git checkout ${env.BRANCH_NAME}"
        script {
             NEW_VERSION = sh (
                  script: 'npm version patch --no-git-tag-version',
                  returnStdout: true
             ).trim()
             echo "version: ${NEW_VERSION}"
        }
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
        echo 'login to DockerHub and push the image'
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

    stage('Commit Version Update') {
      steps {
        script {
          withCredentials([usernamePassword(credentialsId: 'github-cred', usernameVariable: 'USER', passwordVariable: 'PASSWORD')]) {
            sh 'git config --global user.email "jenkins@example.com"'
            sh 'git config --global user.name "jenkins"'

            sh 'git status'
            sh 'git branch'
            sh 'git config --list'

            sh "git remote set-url origin 'https://${USER}:${PASSWORD}@github.com/Ch3di/movienetic.git'"
            sh 'git add .'
            sh "git commit -m 'CI: bump version'"
            sh 'git push origin HEAD:dev'

          }
        }
      }
    }
  }
}
