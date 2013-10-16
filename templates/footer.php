</div>
<footer id="footer" class="webkit-box">
    <a href="operation.php">运营数据</a>
</footer>
<script>
    $(function (){
        var footer = $('#footer'),
            header = $('#header'),
            main = $('.main');

        var winH = $(window).height();
        main.css({
            overflow: "auto",
            height: winH - parseInt(footer.css('height'), 10) - parseInt(header.css('height'), 10),
            marginTop: parseInt(header.css('height'), 10)+20,
            marginBottom: parseInt(footer.css('height'), 10)+20
        });
    });
</script>
  </body>
</html>