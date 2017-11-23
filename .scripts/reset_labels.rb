#!/usr/bin/env ruby

require 'yaml'

FILETYPE = '.md'.freeze

Blog = Struct.new(:post_list, :tags, :ctgs) do
  def reset_labels
    find_labels
    [tags, ctgs].each(&:repopulate)
  end

  private

  def find_labels
    post_list.each do |file|
      load_labels_from(file)
    end
  end

  def load_labels_from(file)
    frontmatter = YAML.load_file(file)
    validate(file, frontmatter)
    tags.list.push(frontmatter['tags'])
    ctgs.list.push(frontmatter['category'])
    tags.tidy_list
    ctgs.tidy_list
  end

  def validate(file, yaml)
    yaml['tags'] = yaml['tags'].split(',').map(&:strip) if yaml['tags'].is_a?(String)
    raise "#{file}: invalid tags"     unless yaml['tags'].is_a?(Array)      || yaml['tags'].nil?
    raise "#{file}: invalid category" unless yaml['category'].is_a?(String) || yaml['category'].nil?
  end
end

Folder = Struct.new(:name) do
  def path
    "#{project_root}/_#{name}"
  end

  def file_list
    Dir["#{path}/*#{FILETYPE}"]
  end

  private

  def project_root
    @project_root ||= begin
      path = File.expand_path(File.dirname(__FILE__))
      until Dir["#{path}/_config.yml"].any?
        path = File.dirname(path)
        raise "no Jekyll project detected at #{@project_root}" if path == '/'
      end
      path
    end
  end
end

Label = Struct.new(:folder, :list) do
  def repopulate
    wipe
    spawn
  end

  def tidy_list
    self.list = list.flatten.map(&:downcase).uniq.reject(&:nil?).reject(&:empty?)
  end

  private

  def wipe
    preexisting = folder.file_list.reject { |file| file =~ /index#{FILETYPE}$/ }
    File.delete(*preexisting)
  end

  def spawn
    list.each do |label|
      File.open("#{folder.path}/#{label}#{FILETYPE}", 'w') do |f|
        f.puts "---\ntitle: #{icon} #{label.capitalize}\n---"
      end
    end
  end

  def icon
    if folder.name == 'tag'
      '🏷'
    elsif folder.name == 'category'
      '📂'
    end
  end
end

posts = Folder.new('posts').file_list
tags  = Label.new(Folder.new('tag'), [])
ctgs  = Label.new(Folder.new('category'), [])
blog  = Blog.new(posts, tags, ctgs)

blog.reset_labels
