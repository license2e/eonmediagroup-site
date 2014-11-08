require 'action_mailer'
set :application, "emg.previewfor.net"#"eonmediagroup.com"
set :current_path, "#{application}"
set :prod_path, "eonmediagroup.com"

default_run_options[:pty] = true

set :scm, :git

role :web, ""       # Your HTTP server, Apache/etc
role :app, ""       # This may be the same as your `Web` server

namespace :deploy do
  
  set(:user) do
    Capistrano::CLI.ui.ask("Enter user: ")
  end
  
  set(:commit_msg) do
    Capistrano::CLI.ui.ask("Enter commit message, or default => ") {|q| 
      q.default = "General Updates on #{DateTime.now.strftime("%m/%d/%Y %H:%I:%S")}"
    }
  end

  set(:last_commit_msg) do
    run_locally "git log -n1 --pretty=oneline --abbrev-commit"
  end
  
  task :setup_notifier do
    ActionMailer::Base.delivery_method = :smtp
    ActionMailer::Base.perform_deliveries = true
    ActionMailer::Base.smtp_settings = {
      :address => "smtp.gmail.com",
      :port => "587",
      :domain => "gmail.com",
      :enable_starttls_auto => true,
      :authentication => :login,
      :user_name => "username",
      :password => "password"
    }
    ActionMailer::Base.raise_delivery_errors = false
    
    class Deployer < ActionMailer::Base
      def notify_testing_team(settings)

        html_body = "<div>The latest changes were deployed to http://#{settings[:application]}!</div><div style=\"background:#eeeeee;border:1px solid maroon;padding:25px;margin:25px 15px;\">#{settings[:message]}</div><div>Thank you,<br />The Deploy Bot</div>"
        text_body = "The latest changes were deployed to http://#{settings[:application]}!\n\n#{settings[:message]}\n\nThank you,\nThe Deploy Bot"

        mail(
          :to => "to@example.com",
          :from => "from@example.com",
          :subject => "Deployment to http://#{settings[:application]}"
        ) do |format|    
          format.text { text_body.to_s }
          format.html { html_body }
        end

      end
    end
  end
  
  desc "Deploy to production"
  task :production do
    puts "Deploying to production"
    transaction do
      setup_notifier
      update_prod_code
      #gem_bundle
      restart_prod
      notify_prod_team
    end
  end
  
  desc "Continue deploy if error occurred"
  task :staging do
    setup_notifier
    update_code
    restart
    notify_team
  end
  
  desc "Running update"
  task :update do
    transaction do
      setup_notifier
      commit_code
      update_code
      #gem_bundle
      restart
      notify_team
    end
  end
  
  task :commit_code, :except => { :no_release => true } do
    run_locally "git status"
    run_locally "git add ."
    run_locally "git commit -m '#{commit_msg}'"
    run_locally "git push origin master"
  end

  task :update_code, :except => { :no_release => true } do
    run "cd #{current_path} && git reset --hard && git pull"
  end

  task :gem_bundle, :except => { :no_release => true } do
    run "cd #{current_path} && bundle"
  end

  task :update_prod_code, :except => { :no_release => true } do
    run "cd #{prod_path} && git reset --hard && git pull"
  end
  
  desc "Restarting mod_rails with restart.txt"
  task :restart, :roles => :app, :except => { :no_release => true } do
    run "touch #{current_path}/tmp/restart.txt"
  end
  
  desc "Restarting mod_rails with restart.txt"
  task :restart_prod, :roles => :app, :except => { :no_release => true } do
    run "touch #{prod_path}/tmp/restart.txt"
  end
  
  desc "Notify the team that the latest changes were deployed to staging"
  task :notify_team do    
    Deployer.notify_testing_team({:application => application, :message => last_commit_msg}).deliver
  end

  desc "Notify the team that the latest changes were deployed to prod"
  task :notify_prod_team do    
    Deployer.notify_testing_team({:application => "www.eonmediagroup.com", :message => "Deployment from staging to Production environment."}).deliver
  end

  [:start, :stop, :check, :setup].each do |t|
    desc "#{t} task is a no-op with mod_rails"
    task t, :roles => :app do ; end
  end
end
