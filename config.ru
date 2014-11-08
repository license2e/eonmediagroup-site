#$LOAD_PATH.unshift("./lib")
$:.unshift File.expand_path("../lib", __FILE__)
ENV['RACK_ENV'] ||= "development"

log = File.new("logs/stdlog-debug.log", "a")
STDOUT.reopen(log)
STDERR.reopen(log)

require 'rack'
require 'rack-cache'
require 'rack-protection'
require 'sinatra/base'
require 'sinatra/content_for2'
require 'sinatra/head'
require 'sinatra/flash'
require 'action_mailer'
require 'yajl'
require 'json'

#require 'rubygems'
#require 'bundler'
#Bundler.require
require './app/emg'

map '/' do 
  run EMG
end
