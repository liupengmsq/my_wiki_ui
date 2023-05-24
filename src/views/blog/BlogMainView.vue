<template>
  <div class="wrapper">
    <div class="main theme-a">
      <div class="nav_container">
        <div class="nav">
          <div>
          左侧边栏内容
          </div>
          <div>
          左侧边栏内容
          </div>
        </div>
      </div>

      <div class="content-container">
        <div class="content-wrapper">
          <div class="content close" ref="explainText">
            <h2 data-v-0e2a562e="" class="title">java-根节点</h2>
            <div data-v-0e2a562e="" class="info">Last updated: 5/20/2023, 10:36:55 PM / Reads: 148</div>
            <hr />
            <p data-v-0e2a562e="">
            <p>Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点</p>

            <pre><code class="language-java"><span class="hljs-keyword">package</span> pengliu.me.backend.demo.nav;

        <span class="hljs-keyword">import</span> org.springframework.beans.factory.annotation.Autowired;
        <span class="hljs-keyword">import</span> org.springframework.stereotype.Service;
        <span class="hljs-keyword">import</span> org.springframework.util.Assert;

        <span class="hljs-keyword">import</span> java.util.List;
        <span class="hljs-keyword">import</span> java.util.Optional;
        <span class="hljs-keyword">import</span> org.springframework.transaction.annotation.Transactional;
        <span class="hljs-keyword">import</span> pengliu.me.backend.demo.wiki.WikiCategory;
        <span class="hljs-keyword">import</span> pengliu.me.backend.demo.wiki.WikiCategoryRepository;

        <span class="hljs-meta">@Service</span>
        <span class="hljs-meta">@Transactional(readOnly = true)</span>
        <span class="hljs-keyword">public</span> <span class="hljs-keyword">class</span> <span class="hljs-title class_">NavTreeService</span> {
            <span class="hljs-meta">@Autowired</span>
            <span class="hljs-keyword">private</span> NavTreeRepository navTreeRepository;
            <span class="hljs-meta">@Autowired</span>
            <span class="hljs-keyword">private</span> WikiCategoryRepository wikiCategoryRepository;

            <span class="hljs-keyword">private</span> <span class="hljs-keyword">void</span> <span class="hljs-title function_">setDepthForNavTree</span><span class="hljs-params">(NavTreeNode root)</span> {
                setDepthForNavTreeNode(root, root.getDepth());
            }

            <span class="hljs-keyword">private</span> <span class="hljs-keyword">void</span> <span class="hljs-title function_">setDepthForNavTreeNode</span><span class="hljs-params">(NavTreeNode current, Integer depth)</span> {
                <span class="hljs-keyword">if</span> (current == <span class="hljs-literal">null</span>) {
                    <span class="hljs-keyword">return</span>;
                }
                current.setDepth(depth);
                <span class="hljs-keyword">for</span> (NavTreeNode child: current.getChildNodes()) {
                    setDepthForNavTreeNode(child, depth + <span class="hljs-number">1</span>);
                }
            }

            <span class="hljs-keyword">public</span> List&lt;NavTreeNode&gt; <span class="hljs-title function_">getAllTreeNodes</span><span class="hljs-params">()</span> {
                <span class="hljs-keyword">return</span> navTreeRepository.findAll();
            }

            <span class="hljs-keyword">public</span> List&lt;NavTreeNode&gt; <span class="hljs-title function_">getTreeNodesByCategoryId</span><span class="hljs-params">(Long categoryId)</span> {
                <span class="hljs-keyword">return</span> navTreeRepository.findByWikiCategoryId(categoryId);
            }

            <span class="hljs-keyword">public</span> List&lt;NavTreeNode&gt; <span class="hljs-title function_">getTreeNodesByCategoryIdAndTarget</span><span class="hljs-params">(Long categoryId, String target)</span> {
                <span class="hljs-keyword">return</span> navTreeRepository.findByWikiCategoryIdAndTarget(categoryId, target);
            }

            <span class="hljs-keyword">public</span> NavTreeNode <span class="hljs-title function_">getTreeNodeById</span><span class="hljs-params">(Long id)</span> {
                Optional&lt;NavTreeNode&gt; node = navTreeRepository.findById(id);
                Assert.isTrue(node.isPresent(), String.format(<span class="hljs-string">"找不到节点 %s\n"</span>, id));
                <span class="hljs-keyword">return</span> node.get();
            }

            <span class="hljs-keyword">public</span> NavTreeNode <span class="hljs-title function_">getTreeRootNodeByCategoryId</span><span class="hljs-params">(Long categoryId)</span> {
                List&lt;NavTreeNode&gt; root = navTreeRepository.findRootNodeByWikiCategoryId(categoryId);
                Assert.isTrue(root.size() &gt; <span class="hljs-number">0</span> , <span class="hljs-string">"找不到根节点"</span>);
                Assert.isTrue(root.size() == <span class="hljs-number">1</span> , <span class="hljs-string">"存在多个根节点"</span>);
                <span class="hljs-keyword">return</span> root.get(<span class="hljs-number">0</span>);
            }

            <span class="hljs-meta">@Transactional(readOnly = false)</span>
            <span class="hljs-keyword">public</span> NavTreeNode <span class="hljs-title function_">createNavTreeNode</span><span class="hljs-params">(Long parentId, NavTreeNode newNode, Long categoryId)</span> {
                <span class="hljs-keyword">if</span> (newNode.getRoot()) {
                    newNode.setDepth(<span class="hljs-number">0</span>);
                    Assert.isTrue(!existRootNodeInNavTree(categoryId), <span class="hljs-string">"已经存在根节点，不能再新建根节点了！！"</span>);
                } <span class="hljs-keyword">else</span> {
                    Optional&lt;NavTreeNode&gt; parent = navTreeRepository.findById(parentId);
                    Assert.isTrue(parent.isPresent(),
                            String.format(<span class="hljs-string">"找不到新节点对应的父节点，\n"</span> +
                                    <span class="hljs-string">"新节点为： %s \n"</span>, newNode.toString()));
                    newNode.setParent(parent.get());
                    newNode.setDepth(parent.get().getDepth() + <span class="hljs-number">1</span>);
                }
                Optional&lt;WikiCategory&gt; category = wikiCategoryRepository.findById(categoryId);
                Assert.isTrue(category.isPresent(), <span class="hljs-string">"指定的 category id 不存在！！"</span>);
                newNode.setWikiCategory(category.get());
                <span class="hljs-keyword">return</span> navTreeRepository.save(newNode);
            }

            <span class="hljs-meta">@Transactional(readOnly = false)</span>
            <span class="hljs-keyword">public</span> Boolean <span class="hljs-title function_">existRootNodeInNavTree</span><span class="hljs-params">(Long categoryId)</span> {
                <span class="hljs-keyword">return</span> navTreeRepository.findRootNodeByWikiCategoryId(categoryId).size() &gt; <span class="hljs-number">0</span>;
            }

            <span class="hljs-meta">@Transactional(readOnly = false)</span>
            <span class="hljs-keyword">public</span> <span class="hljs-keyword">void</span> <span class="hljs-title function_">deleteNavTreeNode</span><span class="hljs-params">(Long id)</span> <span class="hljs-keyword">throws</span> Exception {
                Optional&lt;NavTreeNode&gt; node = navTreeRepository.findById(id);
                Assert.isTrue(node.isPresent(), String.format(<span class="hljs-string">"待删除的节点不存在，其ID为： %s"</span>, id));

                <span class="hljs-keyword">if</span> (node.get().getChildNodes().size() &gt; <span class="hljs-number">0</span> ) {
                    <span class="hljs-keyword">throw</span> <span class="hljs-keyword">new</span> <span class="hljs-title class_">Exception</span>(<span class="hljs-string">"不能删除一个非叶子节点！！"</span>);
                }

                navTreeRepository.deleteById(id);
            }

            <span class="hljs-meta">@Transactional(readOnly = false)</span>
            <span class="hljs-keyword">public</span> <span class="hljs-keyword">void</span> <span class="hljs-title function_">updateNavTreeNode</span><span class="hljs-params">(NavTreeNode nodeToUpdate)</span> {
                Optional&lt;NavTreeNode&gt; node = navTreeRepository.findById(nodeToUpdate.getId());
                Assert.isTrue(node.isPresent(), String.format(<span class="hljs-string">"待更新节点不存在，其ID为：%s"</span>, nodeToUpdate.getId()));

                node.get().setTarget(nodeToUpdate.getTarget());
                node.get().setTitle(nodeToUpdate.getTitle());
                navTreeRepository.save(node.get());
            }
        }
        </code></pre>
            <p>
              Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点
            </p>
            </p>
          </div>
          <div class="show-all">
            <span>{{ textStatus }}</span>
          </div>
        </div>

        <!-- <hr data-v-0e2a562e="" /> -->

        <div class="content-wrapper">
          <div class="content close" ref="explainText">
            <h2 data-v-0e2a562e="" class="title">java-根节点</h2>
            <div data-v-0e2a562e="" class="info">Last updated: 5/20/2023, 10:36:55 PM / Reads: 148</div>
            <hr />
            <p data-v-0e2a562e="">
            <p>Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点</p>

            <pre><code class="language-java"><span class="hljs-keyword">package</span> pengliu.me.backend.demo.nav;

        <span class="hljs-keyword">import</span> org.springframework.beans.factory.annotation.Autowired;
        <span class="hljs-keyword">import</span> org.springframework.stereotype.Service;
        <span class="hljs-keyword">import</span> org.springframework.util.Assert;

        <span class="hljs-keyword">import</span> java.util.List;
        <span class="hljs-keyword">import</span> java.util.Optional;
        <span class="hljs-keyword">import</span> org.springframework.transaction.annotation.Transactional;
        <span class="hljs-keyword">import</span> pengliu.me.backend.demo.wiki.WikiCategory;
        <span class="hljs-keyword">import</span> pengliu.me.backend.demo.wiki.WikiCategoryRepository;

        <span class="hljs-meta">@Service</span>
        <span class="hljs-meta">@Transactional(readOnly = true)</span>
        <span class="hljs-keyword">public</span> <span class="hljs-keyword">class</span> <span class="hljs-title class_">NavTreeService</span> {
            <span class="hljs-meta">@Autowired</span>
            <span class="hljs-keyword">private</span> NavTreeRepository navTreeRepository;
            <span class="hljs-meta">@Autowired</span>
            <span class="hljs-keyword">private</span> WikiCategoryRepository wikiCategoryRepository;

            <span class="hljs-keyword">private</span> <span class="hljs-keyword">void</span> <span class="hljs-title function_">setDepthForNavTree</span><span class="hljs-params">(NavTreeNode root)</span> {
                setDepthForNavTreeNode(root, root.getDepth());
            }

            <span class="hljs-keyword">private</span> <span class="hljs-keyword">void</span> <span class="hljs-title function_">setDepthForNavTreeNode</span><span class="hljs-params">(NavTreeNode current, Integer depth)</span> {
                <span class="hljs-keyword">if</span> (current == <span class="hljs-literal">null</span>) {
                    <span class="hljs-keyword">return</span>;
                }
                current.setDepth(depth);
                <span class="hljs-keyword">for</span> (NavTreeNode child: current.getChildNodes()) {
                    setDepthForNavTreeNode(child, depth + <span class="hljs-number">1</span>);
                }
            }

            <span class="hljs-keyword">public</span> List&lt;NavTreeNode&gt; <span class="hljs-title function_">getAllTreeNodes</span><span class="hljs-params">()</span> {
                <span class="hljs-keyword">return</span> navTreeRepository.findAll();
            }

            <span class="hljs-keyword">public</span> List&lt;NavTreeNode&gt; <span class="hljs-title function_">getTreeNodesByCategoryId</span><span class="hljs-params">(Long categoryId)</span> {
                <span class="hljs-keyword">return</span> navTreeRepository.findByWikiCategoryId(categoryId);
            }

            <span class="hljs-keyword">public</span> List&lt;NavTreeNode&gt; <span class="hljs-title function_">getTreeNodesByCategoryIdAndTarget</span><span class="hljs-params">(Long categoryId, String target)</span> {
                <span class="hljs-keyword">return</span> navTreeRepository.findByWikiCategoryIdAndTarget(categoryId, target);
            }

            <span class="hljs-keyword">public</span> NavTreeNode <span class="hljs-title function_">getTreeNodeById</span><span class="hljs-params">(Long id)</span> {
                Optional&lt;NavTreeNode&gt; node = navTreeRepository.findById(id);
                Assert.isTrue(node.isPresent(), String.format(<span class="hljs-string">"找不到节点 %s\n"</span>, id));
                <span class="hljs-keyword">return</span> node.get();
            }

            <span class="hljs-keyword">public</span> NavTreeNode <span class="hljs-title function_">getTreeRootNodeByCategoryId</span><span class="hljs-params">(Long categoryId)</span> {
                List&lt;NavTreeNode&gt; root = navTreeRepository.findRootNodeByWikiCategoryId(categoryId);
                Assert.isTrue(root.size() &gt; <span class="hljs-number">0</span> , <span class="hljs-string">"找不到根节点"</span>);
                Assert.isTrue(root.size() == <span class="hljs-number">1</span> , <span class="hljs-string">"存在多个根节点"</span>);
                <span class="hljs-keyword">return</span> root.get(<span class="hljs-number">0</span>);
            }

            <span class="hljs-meta">@Transactional(readOnly = false)</span>
            <span class="hljs-keyword">public</span> NavTreeNode <span class="hljs-title function_">createNavTreeNode</span><span class="hljs-params">(Long parentId, NavTreeNode newNode, Long categoryId)</span> {
                <span class="hljs-keyword">if</span> (newNode.getRoot()) {
                    newNode.setDepth(<span class="hljs-number">0</span>);
                    Assert.isTrue(!existRootNodeInNavTree(categoryId), <span class="hljs-string">"已经存在根节点，不能再新建根节点了！！"</span>);
                } <span class="hljs-keyword">else</span> {
                    Optional&lt;NavTreeNode&gt; parent = navTreeRepository.findById(parentId);
                    Assert.isTrue(parent.isPresent(),
                            String.format(<span class="hljs-string">"找不到新节点对应的父节点，\n"</span> +
                                    <span class="hljs-string">"新节点为： %s \n"</span>, newNode.toString()));
                    newNode.setParent(parent.get());
                    newNode.setDepth(parent.get().getDepth() + <span class="hljs-number">1</span>);
                }
                Optional&lt;WikiCategory&gt; category = wikiCategoryRepository.findById(categoryId);
                Assert.isTrue(category.isPresent(), <span class="hljs-string">"指定的 category id 不存在！！"</span>);
                newNode.setWikiCategory(category.get());
                <span class="hljs-keyword">return</span> navTreeRepository.save(newNode);
            }

            <span class="hljs-meta">@Transactional(readOnly = false)</span>
            <span class="hljs-keyword">public</span> Boolean <span class="hljs-title function_">existRootNodeInNavTree</span><span class="hljs-params">(Long categoryId)</span> {
                <span class="hljs-keyword">return</span> navTreeRepository.findRootNodeByWikiCategoryId(categoryId).size() &gt; <span class="hljs-number">0</span>;
            }

            <span class="hljs-meta">@Transactional(readOnly = false)</span>
            <span class="hljs-keyword">public</span> <span class="hljs-keyword">void</span> <span class="hljs-title function_">deleteNavTreeNode</span><span class="hljs-params">(Long id)</span> <span class="hljs-keyword">throws</span> Exception {
                Optional&lt;NavTreeNode&gt; node = navTreeRepository.findById(id);
                Assert.isTrue(node.isPresent(), String.format(<span class="hljs-string">"待删除的节点不存在，其ID为： %s"</span>, id));

                <span class="hljs-keyword">if</span> (node.get().getChildNodes().size() &gt; <span class="hljs-number">0</span> ) {
                    <span class="hljs-keyword">throw</span> <span class="hljs-keyword">new</span> <span class="hljs-title class_">Exception</span>(<span class="hljs-string">"不能删除一个非叶子节点！！"</span>);
                }

                navTreeRepository.deleteById(id);
            }

            <span class="hljs-meta">@Transactional(readOnly = false)</span>
            <span class="hljs-keyword">public</span> <span class="hljs-keyword">void</span> <span class="hljs-title function_">updateNavTreeNode</span><span class="hljs-params">(NavTreeNode nodeToUpdate)</span> {
                Optional&lt;NavTreeNode&gt; node = navTreeRepository.findById(nodeToUpdate.getId());
                Assert.isTrue(node.isPresent(), String.format(<span class="hljs-string">"待更新节点不存在，其ID为：%s"</span>, nodeToUpdate.getId()));

                node.get().setTarget(nodeToUpdate.getTarget());
                node.get().setTitle(nodeToUpdate.getTitle());
                navTreeRepository.save(node.get());
            }
        }
        </code></pre>
            <p>
              Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点
            </p>
            </p>
          </div>
          <div class="show-all">
            <span>{{ textStatus }}</span>
          </div>
        </div>

        <div class="content-wrapper">
          <div class="content close" ref="explainText">
            <h2 data-v-0e2a562e="" class="title">java-根节点</h2>
            <div data-v-0e2a562e="" class="info">Last updated: 5/20/2023, 10:36:55 PM / Reads: 148</div>
            <hr />
            <p data-v-0e2a562e="">
            <p>Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点</p>

            <pre><code class="language-java"><span class="hljs-keyword">package</span> pengliu.me.backend.demo.nav;

        <span class="hljs-keyword">import</span> org.springframework.beans.factory.annotation.Autowired;
        <span class="hljs-keyword">import</span> org.springframework.stereotype.Service;
        <span class="hljs-keyword">import</span> org.springframework.util.Assert;

        <span class="hljs-keyword">import</span> java.util.List;
        <span class="hljs-keyword">import</span> java.util.Optional;
        <span class="hljs-keyword">import</span> org.springframework.transaction.annotation.Transactional;
        <span class="hljs-keyword">import</span> pengliu.me.backend.demo.wiki.WikiCategory;
        <span class="hljs-keyword">import</span> pengliu.me.backend.demo.wiki.WikiCategoryRepository;

        <span class="hljs-meta">@Service</span>
        <span class="hljs-meta">@Transactional(readOnly = true)</span>
        <span class="hljs-keyword">public</span> <span class="hljs-keyword">class</span> <span class="hljs-title class_">NavTreeService</span> {
            <span class="hljs-meta">@Autowired</span>
            <span class="hljs-keyword">private</span> NavTreeRepository navTreeRepository;
            <span class="hljs-meta">@Autowired</span>
            <span class="hljs-keyword">private</span> WikiCategoryRepository wikiCategoryRepository;

            <span class="hljs-keyword">private</span> <span class="hljs-keyword">void</span> <span class="hljs-title function_">setDepthForNavTree</span><span class="hljs-params">(NavTreeNode root)</span> {
                setDepthForNavTreeNode(root, root.getDepth());
            }

            <span class="hljs-keyword">private</span> <span class="hljs-keyword">void</span> <span class="hljs-title function_">setDepthForNavTreeNode</span><span class="hljs-params">(NavTreeNode current, Integer depth)</span> {
                <span class="hljs-keyword">if</span> (current == <span class="hljs-literal">null</span>) {
                    <span class="hljs-keyword">return</span>;
                }
                current.setDepth(depth);
                <span class="hljs-keyword">for</span> (NavTreeNode child: current.getChildNodes()) {
                    setDepthForNavTreeNode(child, depth + <span class="hljs-number">1</span>);
                }
            }

            <span class="hljs-keyword">public</span> List&lt;NavTreeNode&gt; <span class="hljs-title function_">getAllTreeNodes</span><span class="hljs-params">()</span> {
                <span class="hljs-keyword">return</span> navTreeRepository.findAll();
            }

            <span class="hljs-keyword">public</span> List&lt;NavTreeNode&gt; <span class="hljs-title function_">getTreeNodesByCategoryId</span><span class="hljs-params">(Long categoryId)</span> {
                <span class="hljs-keyword">return</span> navTreeRepository.findByWikiCategoryId(categoryId);
            }

            <span class="hljs-keyword">public</span> List&lt;NavTreeNode&gt; <span class="hljs-title function_">getTreeNodesByCategoryIdAndTarget</span><span class="hljs-params">(Long categoryId, String target)</span> {
                <span class="hljs-keyword">return</span> navTreeRepository.findByWikiCategoryIdAndTarget(categoryId, target);
            }

            <span class="hljs-keyword">public</span> NavTreeNode <span class="hljs-title function_">getTreeNodeById</span><span class="hljs-params">(Long id)</span> {
                Optional&lt;NavTreeNode&gt; node = navTreeRepository.findById(id);
                Assert.isTrue(node.isPresent(), String.format(<span class="hljs-string">"找不到节点 %s\n"</span>, id));
                <span class="hljs-keyword">return</span> node.get();
            }

            <span class="hljs-keyword">public</span> NavTreeNode <span class="hljs-title function_">getTreeRootNodeByCategoryId</span><span class="hljs-params">(Long categoryId)</span> {
                List&lt;NavTreeNode&gt; root = navTreeRepository.findRootNodeByWikiCategoryId(categoryId);
                Assert.isTrue(root.size() &gt; <span class="hljs-number">0</span> , <span class="hljs-string">"找不到根节点"</span>);
                Assert.isTrue(root.size() == <span class="hljs-number">1</span> , <span class="hljs-string">"存在多个根节点"</span>);
                <span class="hljs-keyword">return</span> root.get(<span class="hljs-number">0</span>);
            }

            <span class="hljs-meta">@Transactional(readOnly = false)</span>
            <span class="hljs-keyword">public</span> NavTreeNode <span class="hljs-title function_">createNavTreeNode</span><span class="hljs-params">(Long parentId, NavTreeNode newNode, Long categoryId)</span> {
                <span class="hljs-keyword">if</span> (newNode.getRoot()) {
                    newNode.setDepth(<span class="hljs-number">0</span>);
                    Assert.isTrue(!existRootNodeInNavTree(categoryId), <span class="hljs-string">"已经存在根节点，不能再新建根节点了！！"</span>);
                } <span class="hljs-keyword">else</span> {
                    Optional&lt;NavTreeNode&gt; parent = navTreeRepository.findById(parentId);
                    Assert.isTrue(parent.isPresent(),
                            String.format(<span class="hljs-string">"找不到新节点对应的父节点，\n"</span> +
                                    <span class="hljs-string">"新节点为： %s \n"</span>, newNode.toString()));
                    newNode.setParent(parent.get());
                    newNode.setDepth(parent.get().getDepth() + <span class="hljs-number">1</span>);
                }
                Optional&lt;WikiCategory&gt; category = wikiCategoryRepository.findById(categoryId);
                Assert.isTrue(category.isPresent(), <span class="hljs-string">"指定的 category id 不存在！！"</span>);
                newNode.setWikiCategory(category.get());
                <span class="hljs-keyword">return</span> navTreeRepository.save(newNode);
            }

            <span class="hljs-meta">@Transactional(readOnly = false)</span>
            <span class="hljs-keyword">public</span> Boolean <span class="hljs-title function_">existRootNodeInNavTree</span><span class="hljs-params">(Long categoryId)</span> {
                <span class="hljs-keyword">return</span> navTreeRepository.findRootNodeByWikiCategoryId(categoryId).size() &gt; <span class="hljs-number">0</span>;
            }

            <span class="hljs-meta">@Transactional(readOnly = false)</span>
            <span class="hljs-keyword">public</span> <span class="hljs-keyword">void</span> <span class="hljs-title function_">deleteNavTreeNode</span><span class="hljs-params">(Long id)</span> <span class="hljs-keyword">throws</span> Exception {
                Optional&lt;NavTreeNode&gt; node = navTreeRepository.findById(id);
                Assert.isTrue(node.isPresent(), String.format(<span class="hljs-string">"待删除的节点不存在，其ID为： %s"</span>, id));

                <span class="hljs-keyword">if</span> (node.get().getChildNodes().size() &gt; <span class="hljs-number">0</span> ) {
                    <span class="hljs-keyword">throw</span> <span class="hljs-keyword">new</span> <span class="hljs-title class_">Exception</span>(<span class="hljs-string">"不能删除一个非叶子节点！！"</span>);
                }

                navTreeRepository.deleteById(id);
            }

            <span class="hljs-meta">@Transactional(readOnly = false)</span>
            <span class="hljs-keyword">public</span> <span class="hljs-keyword">void</span> <span class="hljs-title function_">updateNavTreeNode</span><span class="hljs-params">(NavTreeNode nodeToUpdate)</span> {
                Optional&lt;NavTreeNode&gt; node = navTreeRepository.findById(nodeToUpdate.getId());
                Assert.isTrue(node.isPresent(), String.format(<span class="hljs-string">"待更新节点不存在，其ID为：%s"</span>, nodeToUpdate.getId()));

                node.get().setTarget(nodeToUpdate.getTarget());
                node.get().setTitle(nodeToUpdate.getTitle());
                navTreeRepository.save(node.get());
            }
        }
        </code></pre>
            <p>
              Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点Vue子节点
            </p>
            </p>
          </div>
          <div class="show-all">
            <span>{{ textStatus }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
    
<script>
import { ref, reactive, toRefs } from 'vue';

export default {
  name: 'BlogMainView',
  setup() {
    const textStatus = ref('阅读全文');
    const explainText = ref(null);

    const getData = () => {
      const height = explainText.value.offsetHeight;
      if (height > 32) {
        isClose.value = true;
        isOver.value = true;
        textStatus.value = '阅读全文';
      }
    }


    return {
      textStatus,
      explainText,
      getData,
    }
  }
}
</script>
    
<style lang="scss" scoped>
.wrapper {
  // 背景图片
  background-color: #2d76c8;
  background-image: url('../../assets/shadow_light.png'), url('../../assets/pixels.png');
  background-position: 0 0, 0 0;
  background-repeat: repeat;
}

.main {
  display: flex;
  max-width: 17.6rem;
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  padding-top: .2rem;
  padding-bottom: .5rem;
}

.title {
  font-size: .35rem;
  // margin: 0 0 .15rem 0;
  // margin: auto;
}

.info {
}

.nav_container {
  background-color: var(--nav-container-background-color);
  // border-right: .01rem solid #dddddd;
  border-radius: .1rem .1rem .1rem .1rem;
  padding-top: .1rem;
  padding-bottom: .1rem;
  overflow-x: auto;
  width: 4rem;
}

.nav {
  font-size: .16rem;
  line-height: .26rem;
  padding: 0 .2rem 0 .2rem;
  box-sizing: border-box;
  user-select: none;
}

.content-container {
  flex: 1;
}

.content-wrapper {
  background-color: var(--wiki-content-background-color);
  padding: .2rem .6rem .2rem .6rem;
  border-radius: .1rem .1rem .1rem .1rem;
  margin-bottom: .2rem;
  margin-left: .5rem;
}

.content {
  background-color: var(--wiki-content-background-color);
  overflow: hidden; // 处理图片image撑大父div的情况
}

.wiki-img {
  width: 10%;
}

.close {
  text-overflow: -o-ellipsis-lastline;
  text-overflow: ellipsis;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 20;
  line-clamp: 20;
  -webkit-box-orient: vertical;
}

.show-all {
  background-color: var(--theme-dropdown-hover-background-color);
  color: var(--button-color);
  padding: .05rem;
  font-size: .15rem;
  font-weight: 500;
  border: none;
  border-radius: 0.1rem;
  height: .26rem;
  text-align: center;
  user-select: none;
  width: .8rem;
  margin-top: 0.2rem;
  cursor: pointer;
}

.show-all:hover {
  background-color: var(--table-row-hover-background-color);
  color: var(--button-color-hover);
}
</style>
    